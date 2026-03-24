export interface MonitorInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale_factor: number;
  frequency: number;
  is_primary: boolean;
  rotation: number;
  width_mm: number;
  height_mm: number;
}

export interface DisplayModeInfo {
  width: number;
  height: number;
  pixel_width: number;
  pixel_height: number;
  refresh_rate: number;
  is_current: boolean;
  is_hidpi: boolean;
}

export interface MouseInfo {
  vendor_id: number;
  product_id: number;
  manufacturer: string;
  product_name: string;
  serial_number: string;
  transport: string;
}

export type DeviceCategory = "monitor" | "mouse";

export interface VcpValue {
  code: number;
  current: number;
  maximum: number;
}

export interface MonitorControls {
  display: VcpValue[];
  color: VcpValue[];
  audio: VcpValue[];
  input: VcpValue[];
}
