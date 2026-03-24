pub mod detect;

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MouseInfo {
    pub vendor_id: u16,
    pub product_id: u16,
    pub manufacturer: String,
    pub product_name: String,
    pub serial_number: String,
    pub transport: String,
}
