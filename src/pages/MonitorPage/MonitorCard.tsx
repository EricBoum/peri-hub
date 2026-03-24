import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Monitor, Star, RotateCw, ChevronRight } from "lucide-react";
import type { MonitorInfo } from "@/types/device";
import { BrightnessSlider } from "./BrightnessSlider";

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

export function MonitorCard({ monitor }: { monitor: MonitorInfo }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const physicalSize =
    monitor.width_mm > 0 && monitor.height_mm > 0
      ? `${(
          Math.sqrt(
            monitor.width_mm * monitor.width_mm +
              monitor.height_mm * monitor.height_mm
          ) / 25.4
        ).toFixed(1)}"`
      : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Monitor className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            {monitor.name || t("monitor.monitorId", { id: monitor.id })}
            {monitor.is_primary && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                <Star className="h-3 w-3" />
                {t("monitor.primary")}
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            ID: {monitor.id}
            {physicalSize && <span className="ml-2">{physicalSize}</span>}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoItem label={t("monitor.resolution")} value={`${monitor.width} × ${monitor.height}`} />
        <InfoItem label={t("monitor.scale")} value={`${(monitor.scale_factor * 100).toFixed(0)}%`} />
        <InfoItem label={t("monitor.refreshRate")} value={`${monitor.frequency.toFixed(0)} Hz`} />
        <InfoItem label={t("monitor.position")} value={`(${monitor.x}, ${monitor.y})`} />
        {monitor.rotation !== 0 && (
          <InfoItem
            label={t("monitor.rotation")}
            value={
              <span className="inline-flex items-center gap-1">
                <RotateCw className="h-3 w-3" />
                {monitor.rotation}°
              </span>
            }
          />
        )}
      </div>

      <div className="mt-4">
        <BrightnessSlider displayId={monitor.id} />
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <button
          onClick={() => navigate(`/monitor/${monitor.id}`)}
          className="inline-flex w-full items-center justify-between rounded-lg px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("monitor.moreSettings")}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
