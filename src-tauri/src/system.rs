use std::collections::HashMap;

#[tauri::command]
pub fn get_system_info() -> HashMap<String, String> {
    let mut info = HashMap::new();
    info.insert("os".to_string(), std::env::consts::OS.to_string());
    info.insert("arch".to_string(), std::env::consts::ARCH.to_string());
    info.insert(
        "current_dir".to_string(),
        std::env::current_dir()
            .map(|p| p.display().to_string())
            .unwrap_or_else(|_| "未知".to_string()),
    );
    info
}
