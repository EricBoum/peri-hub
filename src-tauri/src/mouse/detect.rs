use super::MouseInfo;
use regex::Regex;
use std::collections::HashSet;

// ========== macOS: 通过 ioreg 检测鼠标 ==========

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn detect_mice() -> Result<Vec<MouseInfo>, String> {
    use std::process::Command;

    let output = Command::new("ioreg")
        .args(["-r", "-c", "IOHIDDevice", "-l"])
        .output()
        .map_err(|e| format!("执行 ioreg 失败: {}", e))?;

    let text = String::from_utf8_lossy(&output.stdout);

    let re_usage_page = Regex::new(r#""PrimaryUsagePage"\s*=\s*(\d+)"#).unwrap();
    let re_usage = Regex::new(r#""PrimaryUsage"\s*=\s*(\d+)"#).unwrap();
    let re_product = Regex::new(r#""Product"\s*=\s*"([^"]+)""#).unwrap();
    let re_manufacturer = Regex::new(r#""Manufacturer"\s*=\s*"([^"]+)""#).unwrap();
    let re_vendor_id = Regex::new(r#""VendorID"\s*=\s*(\d+)"#).unwrap();
    let re_product_id = Regex::new(r#""ProductID"\s*=\s*(\d+)"#).unwrap();
    let re_serial = Regex::new(r#""SerialNumber"\s*=\s*"([^"]*?)""#).unwrap();
    let re_transport = Regex::new(r#""Transport"\s*=\s*"([^"]+)""#).unwrap();

    let blocks: Vec<&str> = text.split("+-o ").collect();
    let mut seen = HashSet::new();
    let mut mice = Vec::new();

    for block in blocks {
        let usage_page = re_usage_page
            .captures(block)
            .and_then(|c| c[1].parse::<u16>().ok())
            .unwrap_or(0);
        let usage = re_usage
            .captures(block)
            .and_then(|c| c[1].parse::<u16>().ok())
            .unwrap_or(0);

        if usage_page != 1 || usage != 2 {
            continue;
        }

        let vendor_id = re_vendor_id
            .captures(block)
            .and_then(|c| c[1].parse::<u16>().ok())
            .unwrap_or(0);
        let product_id = re_product_id
            .captures(block)
            .and_then(|c| c[1].parse::<u16>().ok())
            .unwrap_or(0);

        let key = (vendor_id, product_id);
        if !seen.insert(key) {
            continue;
        }

        let product_name = re_product
            .captures(block)
            .map(|c| c[1].to_string())
            .unwrap_or_else(|| "未知设备".to_string());
        let manufacturer = re_manufacturer
            .captures(block)
            .map(|c| c[1].to_string())
            .unwrap_or_else(|| "未知".to_string());
        let serial_number = re_serial
            .captures(block)
            .map(|c| c[1].to_string())
            .unwrap_or_default();
        let transport = re_transport
            .captures(block)
            .map(|c| c[1].to_string())
            .unwrap_or_else(|| "未知".to_string());

        mice.push(MouseInfo {
            vendor_id,
            product_id,
            manufacturer,
            product_name,
            serial_number,
            transport,
        });
    }

    Ok(mice)
}

// ========== Windows: 通过 hidapi 检测鼠标 ==========

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn detect_mice() -> Result<Vec<MouseInfo>, String> {
    let api = hidapi::HidApi::new().map_err(|e| format!("HID 初始化失败: {}", e))?;

    let mut seen = HashSet::new();
    let mut mice = Vec::new();

    for device in api.device_list() {
        // 过滤鼠标：usage_page=1 (Generic Desktop), usage=2 (Mouse)
        if device.usage_page() != 1 || device.usage() != 2 {
            continue;
        }

        let vid = device.vendor_id();
        let pid = device.product_id();
        let key = (vid, pid);
        if !seen.insert(key) {
            continue;
        }

        let product_name = device
            .product_string()
            .unwrap_or("Unknown Device")
            .to_string();
        let manufacturer = device
            .manufacturer_string()
            .unwrap_or("Unknown")
            .to_string();
        let serial_number = device
            .serial_number()
            .unwrap_or("")
            .to_string();
        let transport = match device.bus_type() {
            hidapi::BusType::Usb => "USB",
            hidapi::BusType::Bluetooth => "Bluetooth",
            _ => "Unknown",
        }
        .to_string();

        mice.push(MouseInfo {
            vendor_id: vid,
            product_id: pid,
            manufacturer,
            product_name,
            serial_number,
            transport,
        });
    }

    Ok(mice)
}
