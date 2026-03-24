import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { MonitorInfo, MouseInfo } from "@/types/device";

export function useDevices() {
  const [monitors, setMonitors] = useState<MonitorInfo[]>([]);
  const [mice, setMice] = useState<MouseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [monitorResult, miceResult] = await Promise.all([
        invoke<MonitorInfo[]>("detect_monitors"),
        invoke<MouseInfo[]>("detect_mice"),
      ]);
      setMonitors(monitorResult);
      setMice(miceResult);
    } catch (err) {
      console.error("设备检测失败:", err);
      setMonitors([]);
      setMice([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { monitors, mice, loading, refresh };
}
