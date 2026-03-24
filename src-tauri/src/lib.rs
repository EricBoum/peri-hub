mod monitor;
mod mouse;
mod ddc;
mod system;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            system::get_system_info,
            monitor::detect::detect_monitors,
            monitor::display_mode::get_display_modes,
            monitor::display_mode::set_display_mode,
            monitor::brightness::get_brightness,
            monitor::brightness::set_brightness,
            mouse::detect::detect_mice,
            ddc::controls::probe_monitor_controls,
            ddc::controls::get_vcp_value,
            ddc::controls::set_vcp_value,
        ])
        .run(tauri::generate_context!())
        .expect("启动应用失败");
}
