use super::{MonitorControls, VcpValue};

// ========== macOS: ddc-macos crate ==========

#[cfg(target_os = "macos")]
fn find_ddc_monitor(display_id: u32) -> Result<ddc_macos::Monitor, String> {
    let monitors = ddc_macos::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    monitors
        .into_iter()
        .find(|m| m.handle().id == display_id)
        .ok_or("该显示器不支持 DDC".to_string())
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn probe_monitor_controls(display_id: u32) -> Result<MonitorControls, String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;

    let try_read = |mon: &mut ddc_macos::Monitor, code: u8| -> Option<VcpValue> {
        mon.get_vcp_feature(code).ok().map(|v| VcpValue {
            code,
            current: v.value(),
            maximum: v.maximum(),
        })
    };

    let display: Vec<VcpValue> = [0x10u8, 0x12, 0x87]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let color: Vec<VcpValue> = [0x8Au8, 0x16, 0x18, 0x1A]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let audio: Vec<VcpValue> = [0x62u8]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let input: Vec<VcpValue> = [0x60u8, 0xD6]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    Ok(MonitorControls { display, color, audio, input })
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn get_vcp_value(display_id: u32, code: u8) -> Result<VcpValue, String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;
    let val = monitor
        .get_vcp_feature(code)
        .map_err(|e| format!("DDC 读取 VCP 0x{:02X} 失败: {}", code, e))?;
    Ok(VcpValue {
        code,
        current: val.value(),
        maximum: val.maximum(),
    })
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn set_vcp_value(display_id: u32, code: u8, value: u16) -> Result<(), String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;
    monitor
        .set_vcp_feature(code, value)
        .map_err(|e| format!("DDC 设置 VCP 0x{:02X} 失败: {}", code, e))?;
    Ok(())
}

// ========== Windows: ddc-winapi crate ==========

#[cfg(target_os = "windows")]
fn find_ddc_monitor(display_id: u32) -> Result<ddc_winapi::Monitor, String> {
    let monitors = ddc_winapi::Monitor::enumerate()
        .map_err(|e| format!("DDC 枚举失败: {}", e))?;
    monitors
        .into_iter()
        .nth(display_id as usize)
        .ok_or("该显示器不支持 DDC".to_string())
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn probe_monitor_controls(display_id: u32) -> Result<MonitorControls, String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;

    let try_read = |mon: &mut ddc_winapi::Monitor, code: u8| -> Option<VcpValue> {
        mon.get_vcp_feature(code).ok().map(|v| VcpValue {
            code,
            current: v.value(),
            maximum: v.maximum(),
        })
    };

    let display: Vec<VcpValue> = [0x10u8, 0x12, 0x87]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let color: Vec<VcpValue> = [0x8Au8, 0x16, 0x18, 0x1A]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let audio: Vec<VcpValue> = [0x62u8]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    let input: Vec<VcpValue> = [0x60u8, 0xD6]
        .iter()
        .filter_map(|&c| try_read(&mut monitor, c))
        .collect();

    Ok(MonitorControls { display, color, audio, input })
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn get_vcp_value(display_id: u32, code: u8) -> Result<VcpValue, String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;
    let val = monitor
        .get_vcp_feature(code)
        .map_err(|e| format!("DDC 读取 VCP 0x{:02X} 失败: {}", code, e))?;
    Ok(VcpValue {
        code,
        current: val.value(),
        maximum: val.maximum(),
    })
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn set_vcp_value(display_id: u32, code: u8, value: u16) -> Result<(), String> {
    use ddc::Ddc;
    let mut monitor = find_ddc_monitor(display_id)?;
    monitor
        .set_vcp_feature(code, value)
        .map_err(|e| format!("DDC 设置 VCP 0x{:02X} 失败: {}", code, e))?;
    Ok(())
}
