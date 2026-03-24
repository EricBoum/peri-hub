import { Routes, Route, Navigate } from "react-router-dom";
import { DeviceProvider } from "./components/DeviceProvider";
import { AppLayout } from "./layouts/AppLayout";
import { MonitorPage } from "./pages/MonitorPage";
import { MonitorDetailPage } from "./pages/MonitorDetailPage";
import { MousePage } from "./pages/MousePage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <DeviceProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/monitor" replace />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/monitor/:id" element={<MonitorDetailPage />} />
          <Route path="/mouse" element={<MousePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </DeviceProvider>
  );
}

export default App;
