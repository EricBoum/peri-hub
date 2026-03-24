pub mod detect;
pub mod display_mode;
pub mod brightness;

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MonitorInfo {
    pub id: u32,
    pub name: String,
    pub width: u32,
    pub height: u32,
    pub x: i32,
    pub y: i32,
    pub scale_factor: f32,
    pub frequency: f32,
    pub is_primary: bool,
    pub rotation: f32,
    pub width_mm: i32,
    pub height_mm: i32,
}
