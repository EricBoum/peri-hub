pub mod controls;

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct VcpValue {
    pub code: u8,
    pub current: u16,
    pub maximum: u16,
}

#[derive(Debug, Serialize)]
pub struct MonitorControls {
    pub display: Vec<VcpValue>,
    pub color: Vec<VcpValue>,
    pub audio: Vec<VcpValue>,
    pub input: Vec<VcpValue>,
}
