use super::MonitorInfo;
use display_info::DisplayInfo;

#[tauri::command]
pub fn detect_monitors() -> Result<Vec<MonitorInfo>, String> {
    let displays = DisplayInfo::all().map_err(|e| format!("检测显示器失败: {}", e))?;

    let monitors = displays
        .into_iter()
        .map(|d| MonitorInfo {
            id: d.id,
            name: d.name,
            width: d.width,
            height: d.height,
            x: d.x,
            y: d.y,
            scale_factor: d.scale_factor,
            frequency: d.frequency,
            is_primary: d.is_primary,
            rotation: d.rotation,
            width_mm: d.width_mm,
            height_mm: d.height_mm,
        })
        .collect();

    Ok(monitors)
}
