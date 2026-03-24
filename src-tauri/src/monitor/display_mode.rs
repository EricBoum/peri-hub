use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::ffi::c_void;

#[derive(Debug, Serialize)]
pub struct DisplayModeInfo {
    pub width: u32,
    pub height: u32,
    pub pixel_width: u32,
    pub pixel_height: u32,
    pub refresh_rate: f64,
    pub is_current: bool,
    pub is_hidpi: bool,
}

#[derive(Debug, Deserialize)]
pub struct SetModeParams {
    pub display_id: u32,
    pub width: u32,
    pub height: u32,
    pub refresh_rate: f64,
    pub is_hidpi: bool,
}

// ========== macOS CoreGraphics FFI ==========

#[cfg(target_os = "macos")]
mod cg {
    use core_foundation::array::CFArrayRef;
    use core_graphics::display::CGDirectDisplayID;
    use std::ffi::c_void;

    pub type CGDisplayModeRef = *mut c_void;
    pub type CGDisplayConfigRef = *mut c_void;

    #[link(name = "CoreGraphics", kind = "framework")]
    extern "C" {
        pub static kCGDisplayShowDuplicateLowResolutionModes: *const c_void;
        pub fn CGDisplayCopyAllDisplayModes(
            display: CGDirectDisplayID,
            options: *const c_void,
        ) -> CFArrayRef;
        pub fn CGDisplayCopyDisplayMode(display: CGDirectDisplayID) -> CGDisplayModeRef;
        pub fn CGDisplayModeGetWidth(mode: CGDisplayModeRef) -> usize;
        pub fn CGDisplayModeGetHeight(mode: CGDisplayModeRef) -> usize;
        pub fn CGDisplayModeGetRefreshRate(mode: CGDisplayModeRef) -> f64;
        pub fn CGDisplayModeGetPixelWidth(mode: CGDisplayModeRef) -> usize;
        pub fn CGDisplayModeGetPixelHeight(mode: CGDisplayModeRef) -> usize;
        pub fn CGDisplayModeRelease(mode: CGDisplayModeRef);
        pub fn CGBeginDisplayConfiguration(config: *mut CGDisplayConfigRef) -> i32;
        pub fn CGConfigureDisplayWithDisplayMode(
            config: CGDisplayConfigRef,
            display: CGDirectDisplayID,
            mode: CGDisplayModeRef,
            options: *const c_void,
        ) -> i32;
        pub fn CGCompleteDisplayConfiguration(
            config: CGDisplayConfigRef,
            option: u32,
        ) -> i32;
    }

    pub unsafe fn cf_array_get(arr: CFArrayRef, idx: isize) -> *const c_void {
        core_foundation::array::CFArrayGetValueAtIndex(arr, idx)
    }

    pub unsafe fn cf_array_count(arr: CFArrayRef) -> isize {
        core_foundation::array::CFArrayGetCount(arr)
    }
}

// ========== macOS 实现 ==========

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn get_display_modes(display_id: u32) -> Result<Vec<DisplayModeInfo>, String> {
    unsafe {
        let current = cg::CGDisplayCopyDisplayMode(display_id);
        if current.is_null() {
            return Err("无法获取当前显示模式".to_string());
        }
        let cur_w = cg::CGDisplayModeGetWidth(current);
        let cur_h = cg::CGDisplayModeGetHeight(current);
        let cur_pw = cg::CGDisplayModeGetPixelWidth(current);
        let cur_rr = cg::CGDisplayModeGetRefreshRate(current);

        use core_foundation::base::TCFType;
        use core_foundation::boolean::CFBoolean;
        use core_foundation::dictionary::CFDictionary;
        use core_foundation::string::CFString;

        let cf_key = CFString::wrap_under_get_rule(
            cg::kCGDisplayShowDuplicateLowResolutionModes as core_foundation::string::CFStringRef,
        );
        let options = CFDictionary::from_CFType_pairs(&[(
            cf_key.as_CFType(),
            CFBoolean::true_value().as_CFType(),
        )]);

        let arr = cg::CGDisplayCopyAllDisplayModes(
            display_id,
            options.as_concrete_TypeRef() as *const c_void,
        );

        if arr.is_null() {
            cg::CGDisplayModeRelease(current);
            return Err("无法获取可用显示模式列表".to_string());
        }

        let count = cg::cf_array_count(arr);
        let mut seen: HashSet<(u32, u32, u64, bool)> = HashSet::new();
        let mut modes = Vec::new();

        for i in 0..count {
            let mode = cg::cf_array_get(arr, i) as cg::CGDisplayModeRef;

            let w = cg::CGDisplayModeGetWidth(mode) as u32;
            let h = cg::CGDisplayModeGetHeight(mode) as u32;
            let rr = cg::CGDisplayModeGetRefreshRate(mode);
            let pw = cg::CGDisplayModeGetPixelWidth(mode) as u32;
            let ph = cg::CGDisplayModeGetPixelHeight(mode) as u32;
            let is_hidpi = pw > w;

            let key = (w, h, (rr * 10.0) as u64, is_hidpi);
            if !seen.insert(key) {
                continue;
            }

            let is_current =
                w == cur_w as u32 && h == cur_h as u32 && pw == cur_pw as u32 && (rr - cur_rr).abs() < 0.5;

            modes.push(DisplayModeInfo {
                width: w,
                height: h,
                pixel_width: pw,
                pixel_height: ph,
                refresh_rate: rr,
                is_current,
                is_hidpi,
            });
        }

        cg::CGDisplayModeRelease(current);
        core_foundation::base::CFRelease(arr as *const c_void);

        modes.sort_by(|a, b| {
            b.width
                .cmp(&a.width)
                .then(b.height.cmp(&a.height))
                .then(b.is_hidpi.cmp(&a.is_hidpi))
                .then(b.refresh_rate.partial_cmp(&a.refresh_rate).unwrap())
        });

        Ok(modes)
    }
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn set_display_mode(params: SetModeParams) -> Result<(), String> {
    unsafe {
        use core_foundation::base::TCFType;
        use core_foundation::boolean::CFBoolean;
        use core_foundation::dictionary::CFDictionary;
        use core_foundation::string::CFString;

        let cf_key = CFString::wrap_under_get_rule(
            cg::kCGDisplayShowDuplicateLowResolutionModes as core_foundation::string::CFStringRef,
        );
        let options = CFDictionary::from_CFType_pairs(&[(
            cf_key.as_CFType(),
            CFBoolean::true_value().as_CFType(),
        )]);

        let arr = cg::CGDisplayCopyAllDisplayModes(
            params.display_id,
            options.as_concrete_TypeRef() as *const c_void,
        );
        if arr.is_null() {
            return Err("无法获取可用显示模式列表".to_string());
        }

        let count = cg::cf_array_count(arr);
        let mut best_mode: cg::CGDisplayModeRef = std::ptr::null_mut();
        let mut best_pixel_w: usize = 0;

        for i in 0..count {
            let mode = cg::cf_array_get(arr, i) as cg::CGDisplayModeRef;
            let w = cg::CGDisplayModeGetWidth(mode) as u32;
            let h = cg::CGDisplayModeGetHeight(mode) as u32;
            let rr = cg::CGDisplayModeGetRefreshRate(mode);
            let pw = cg::CGDisplayModeGetPixelWidth(mode);
            let is_hidpi = pw > w as usize;

            if w == params.width
                && h == params.height
                && (rr - params.refresh_rate).abs() < 0.5
                && is_hidpi == params.is_hidpi
            {
                if pw > best_pixel_w {
                    best_pixel_w = pw;
                    best_mode = mode;
                }
            }
        }

        if best_mode.is_null() {
            core_foundation::base::CFRelease(arr as *const c_void);
            return Err(format!(
                "找不到匹配的显示模式: {}x{} @ {:.0}Hz",
                params.width, params.height, params.refresh_rate
            ));
        }

        let mut config: cg::CGDisplayConfigRef = std::ptr::null_mut();
        let err = cg::CGBeginDisplayConfiguration(&mut config);
        if err != 0 {
            core_foundation::base::CFRelease(arr as *const c_void);
            return Err(format!("开始配置失败: 错误码 {}", err));
        }

        let err = cg::CGConfigureDisplayWithDisplayMode(
            config,
            params.display_id,
            best_mode,
            std::ptr::null(),
        );
        if err != 0 {
            core_foundation::base::CFRelease(arr as *const c_void);
            return Err(format!("配置显示模式失败: 错误码 {}", err));
        }

        let err = cg::CGCompleteDisplayConfiguration(config, 2);
        core_foundation::base::CFRelease(arr as *const c_void);
        if err != 0 {
            return Err(format!("应用配置失败: 错误码 {}", err));
        }

        Ok(())
    }
}

// ========== Windows 实现 ==========

#[cfg(target_os = "windows")]
mod win {
    use std::collections::HashSet;
    use std::mem;
    use windows::Win32::Graphics::Gdi::{
        ChangeDisplaySettingsExW, EnumDisplayDevicesW, EnumDisplaySettingsW,
        CDS_TYPE, DEVMODEW, DISPLAY_DEVICEW, DISP_CHANGE_SUCCESSFUL,
        ENUM_CURRENT_SETTINGS, ENUM_DISPLAY_SETTINGS_MODE,
    };
    use windows::core::PCWSTR;

    use super::DisplayModeInfo;

    pub fn get_modes(display_id: u32) -> Result<Vec<DisplayModeInfo>, String> {
        unsafe {
            // 找到对应 display_id 的设备名
            let device_name = find_device_name(display_id)?;

            // 获取当前模式
            let mut cur_mode: DEVMODEW = mem::zeroed();
            cur_mode.dmSize = mem::size_of::<DEVMODEW>() as u16;
            let device_name_pcwstr = PCWSTR(device_name.as_ptr());
            EnumDisplaySettingsW(
                device_name_pcwstr,
                ENUM_CURRENT_SETTINGS,
                &mut cur_mode,
            )
            .map_err(|_| "无法获取当前显示模式".to_string())?;

            // 枚举所有模式
            let mut seen: HashSet<(u32, u32, u64)> = HashSet::new();
            let mut modes = Vec::new();
            let mut i: u32 = 0;

            loop {
                let mut dm: DEVMODEW = mem::zeroed();
                dm.dmSize = mem::size_of::<DEVMODEW>() as u16;
                if EnumDisplaySettingsW(
                    device_name_pcwstr,
                    ENUM_DISPLAY_SETTINGS_MODE(i),
                    &mut dm,
                )
                .is_err()
                {
                    break;
                }

                let w = dm.dmPelsWidth;
                let h = dm.dmPelsHeight;
                let rr = dm.dmDisplayFrequency as f64;

                let key = (w, h, (rr * 10.0) as u64);
                if seen.insert(key) {
                    let is_current = w == cur_mode.dmPelsWidth
                        && h == cur_mode.dmPelsHeight
                        && dm.dmDisplayFrequency == cur_mode.dmDisplayFrequency;

                    modes.push(DisplayModeInfo {
                        width: w,
                        height: h,
                        pixel_width: w,
                        pixel_height: h,
                        refresh_rate: rr,
                        is_current,
                        is_hidpi: false,
                    });
                }

                i += 1;
            }

            modes.sort_by(|a, b| {
                b.width
                    .cmp(&a.width)
                    .then(b.height.cmp(&a.height))
                    .then(b.refresh_rate.partial_cmp(&a.refresh_rate).unwrap())
            });

            Ok(modes)
        }
    }

    pub fn set_mode(
        display_id: u32,
        width: u32,
        height: u32,
        refresh_rate: f64,
    ) -> Result<(), String> {
        unsafe {
            let device_name = find_device_name(display_id)?;

            let mut dm: DEVMODEW = mem::zeroed();
            dm.dmSize = mem::size_of::<DEVMODEW>() as u16;
            dm.dmPelsWidth = width;
            dm.dmPelsHeight = height;
            dm.dmDisplayFrequency = refresh_rate.round() as u32;
            dm.dmFields = 0x00080000 | 0x00100000 | 0x00400000; // DM_PELSWIDTH | DM_PELSHEIGHT | DM_DISPLAYFREQUENCY

            let device_name_pcwstr = PCWSTR(device_name.as_ptr());
            let result = ChangeDisplaySettingsExW(
                device_name_pcwstr,
                Some(&dm),
                None,
                CDS_TYPE(0),
                None,
            );

            if result == DISP_CHANGE_SUCCESSFUL {
                Ok(())
            } else {
                Err(format!("切换显示模式失败: 错误码 {:?}", result))
            }
        }
    }

    /// 根据 display_id (来自 display-info crate) 找到 Windows DISPLAY_DEVICE 名称
    unsafe fn find_device_name(display_id: u32) -> Result<Vec<u16>, String> {
        let mut i: u32 = 0;
        loop {
            let mut dd: DISPLAY_DEVICEW = mem::zeroed();
            dd.cb = mem::size_of::<DISPLAY_DEVICEW>() as u32;
            if EnumDisplayDevicesW(PCWSTR::null(), i, &mut dd, 0).is_err() {
                break;
            }
            // display-info 在 Windows 上 id 是从 0 开始的索引
            if i == display_id {
                return Ok(dd.DeviceName.to_vec());
            }
            i += 1;
        }
        Err(format!("找不到 display_id={} 对应的显示设备", display_id))
    }
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn get_display_modes(display_id: u32) -> Result<Vec<DisplayModeInfo>, String> {
    win::get_modes(display_id)
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn set_display_mode(params: SetModeParams) -> Result<(), String> {
    win::set_mode(params.display_id, params.width, params.height, params.refresh_rate)
}
