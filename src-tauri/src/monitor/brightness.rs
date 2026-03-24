// ========== macOS: DisplayServices 私有框架 + DDC fallback ==========

#[cfg(target_os = "macos")]
mod macos {
    use std::ffi::CString;
    use std::sync::OnceLock;

    type CGDirectDisplayID = u32;
    type GetBrightnessFn = unsafe extern "C" fn(CGDirectDisplayID, *mut f32) -> i32;
    type SetBrightnessFn = unsafe extern "C" fn(CGDirectDisplayID, f32) -> i32;

    struct DisplayServicesFns {
        get: GetBrightnessFn,
        set: SetBrightnessFn,
    }

    static FNS: OnceLock<Option<DisplayServicesFns>> = OnceLock::new();

    fn load_fns() -> Option<DisplayServicesFns> {
        unsafe {
            let path = CString::new(
                "/System/Library/PrivateFrameworks/DisplayServices.framework/DisplayServices",
            )
            .ok()?;
            let handle = libc::dlopen(path.as_ptr(), libc::RTLD_LAZY);
            if handle.is_null() {
                return None;
            }
            let get_name = CString::new("DisplayServicesGetBrightness").ok()?;
            let set_name = CString::new("DisplayServicesSetBrightness").ok()?;
            let get_ptr = libc::dlsym(handle, get_name.as_ptr());
            let set_ptr = libc::dlsym(handle, set_name.as_ptr());
            if get_ptr.is_null() || set_ptr.is_null() {
                return None;
            }
            Some(DisplayServicesFns {
                get: std::mem::transmute(get_ptr),
                set: std::mem::transmute(set_ptr),
            })
        }
    }

    #[link(name = "CoreGraphics", kind = "framework")]
    extern "C" {
        fn CGDisplayIsBuiltin(display: CGDirectDisplayID) -> u32;
    }

    pub fn is_builtin(display_id: u32) -> bool {
        unsafe { CGDisplayIsBuiltin(display_id) != 0 }
    }

    pub fn get_builtin_brightness(display_id: u32) -> Result<f32, String> {
        let fns = FNS
            .get_or_init(load_fns)
            .as_ref()
            .ok_or("无法加载 DisplayServices")?;
        let mut val: f32 = 0.0;
        let ret = unsafe { (fns.get)(display_id, &mut val) };
        if ret == 0 { Ok(val) } else { Err("无法获取亮度".to_string()) }
    }

    pub fn set_builtin_brightness(display_id: u32, value: f32) -> Result<(), String> {
        let fns = FNS
            .get_or_init(load_fns)
            .as_ref()
            .ok_or("无法加载 DisplayServices")?;
        let ret = unsafe { (fns.set)(display_id, value) };
        if ret == 0 { Ok(()) } else { Err("无法设置亮度".to_string()) }
    }
}

// ========== DDC 亮度（跨平台，但底层 crate 按平台选择） ==========

#[cfg(target_os = "macos")]
fn get_brightness_ddc(display_id: u32) -> Result<f32, String> {
    use ddc::Ddc;
    let monitors = ddc_macos::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    let mut monitor = monitors
        .into_iter()
        .find(|m| m.handle().id == display_id)
        .ok_or("该显示器不支持 DDC 亮度调节")?;
    let val = monitor
        .get_vcp_feature(0x10)
        .map_err(|e| format!("DDC 读取亮度失败: {}", e))?;
    Ok(val.value() as f32 / val.maximum() as f32)
}

#[cfg(target_os = "macos")]
fn set_brightness_ddc(display_id: u32, value: f32) -> Result<(), String> {
    use ddc::Ddc;
    let monitors = ddc_macos::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    let mut monitor = monitors
        .into_iter()
        .find(|m| m.handle().id == display_id)
        .ok_or("该显示器不支持 DDC 亮度调节")?;
    let current = monitor
        .get_vcp_feature(0x10)
        .map_err(|e| format!("DDC 读取亮度失败: {}", e))?;
    let max = current.maximum();
    let target = (value * max as f32).round() as u16;
    monitor
        .set_vcp_feature(0x10, target)
        .map_err(|e| format!("DDC 设置亮度失败: {}", e))?;
    Ok(())
}

// ========== 命令入口 ==========

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn get_brightness(display_id: u32) -> Result<f32, String> {
    if macos::is_builtin(display_id) {
        return macos::get_builtin_brightness(display_id);
    }
    get_brightness_ddc(display_id)
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn set_brightness(display_id: u32, value: f32) -> Result<(), String> {
    let value = value.clamp(0.0, 1.0);
    if macos::is_builtin(display_id) {
        return macos::set_builtin_brightness(display_id, value);
    }
    set_brightness_ddc(display_id, value)
}

// ========== Windows 实现 ==========
// 策略：先尝试 Win32 物理监视器 API（外接屏），失败则尝试 DDC

#[cfg(target_os = "windows")]
fn get_brightness_ddc(display_id: u32) -> Result<f32, String> {
    use ddc::Ddc;
    let monitors = ddc_winapi::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    // Windows 上通过索引匹配（display-info id 从 0 开始）
    let mut monitor = monitors
        .into_iter()
        .nth(display_id as usize)
        .ok_or("该显示器不支持亮度调节")?;
    let val = monitor
        .get_vcp_feature(0x10)
        .map_err(|e| format!("DDC 读取亮度失败: {}", e))?;
    Ok(val.value() as f32 / val.maximum() as f32)
}

#[cfg(target_os = "windows")]
fn set_brightness_ddc(display_id: u32, value: f32) -> Result<(), String> {
    use ddc::Ddc;
    let monitors = ddc_winapi::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    let mut monitor = monitors
        .into_iter()
        .nth(display_id as usize)
        .ok_or("该显示器不支持亮度调节")?;
    let current = monitor
        .get_vcp_feature(0x10)
        .map_err(|e| format!("DDC 读取亮度失败: {}", e))?;
    let max = current.maximum();
    let target = (value * max as f32).round() as u16;
    monitor
        .set_vcp_feature(0x10, target)
        .map_err(|e| format!("DDC 设置亮度失败: {}", e))?;
    Ok(())
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn get_brightness(display_id: u32) -> Result<f32, String> {
    get_brightness_ddc(display_id)
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn set_brightness(display_id: u32, value: f32) -> Result<(), String> {
    let value = value.clamp(0.0, 1.0);
    set_brightness_ddc(display_id, value)
}
