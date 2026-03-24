import { createContext, useContext } from "react";
import { useDevices } from "@/hooks/useDevices";
import type { MonitorInfo, MouseInfo } from "@/types/device";

interface DeviceContextValue {
  monitors: MonitorInfo[];
  mice: MouseInfo[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextValue>({
  monitors: [],
  mice: [],
  loading: true,
  refresh: async () => {},
});

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const devices = useDevices();
  return (
    <DeviceContext.Provider value={devices}>{children}</DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  return useContext(DeviceContext);
}
