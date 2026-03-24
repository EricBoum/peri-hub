import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Monitor,
  Star,
  Loader2,
  SlidersHorizontal,
  Palette,
  Volume2,
  Plug,
} from "lucide-react";
import { useDeviceContext } from "@/components/DeviceProvider";
import { Collapsible } from "@/components/Collapsible";
import { ResolutionPanel } from "./ResolutionPanel";
import { VcpControlsSection } from "./VcpControlsSection";
import type { MonitorControls } from "@/types/device";

export function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { monitors } = useDeviceContext();
  const displayId = Number(id);
  const monitor = monitors.find((m) => m.id === displayId);

  const [controls, setControls] = useState<MonitorControls | null>(null);
  const [probing, setProbing] = useState(true);
  const [ddcError, setDdcError] = useState(false);

  useEffect(() => {
    if (!displayId) return;
    setProbing(true);
    invoke<MonitorControls>("probe_monitor_controls", { displayId })
      .then((result) => setControls(result))
      .catch(() => setDdcError(true))
      .finally(() => setProbing(false));
  }, [displayId]);

  if (!monitor) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/monitor")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </button>
        <p className="text-muted-foreground">{t("monitor.notFound")}</p>
      </div>
    );
  }

  const hasDisplay = controls && controls.display.length > 0;
  const hasColor = controls && controls.color.length > 0;
  const hasAudio = controls && controls.audio.length > 0;
  const hasInput = controls && controls.input.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/monitor")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Monitor className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              {monitor.name || t("monitor.monitorId", { id: monitor.id })}
              {monitor.is_primary && (
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  <Star className="h-3 w-3" />
                  {t("monitor.primary")}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("monitor.current", {
                width: monitor.width,
                height: monitor.height,
                frequency: monitor.frequency.toFixed(0),
              })}
            </p>
          </div>
        </div>
      </div>

      <Collapsible
        title={t("monitor.resolutionAndRefreshRate")}
        icon={Monitor}
        defaultOpen
      >
        <ResolutionPanel displayId={displayId} />
      </Collapsible>

      {probing ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("controls.probing")}
        </div>
      ) : ddcError ? null : (
        <>
          {hasDisplay && (
            <Collapsible title={t("controls.display")} icon={SlidersHorizontal} defaultOpen>
              <VcpControlsSection displayId={displayId} controls={controls!.display} />
            </Collapsible>
          )}
          {hasColor && (
            <Collapsible title={t("controls.color")} icon={Palette}>
              <VcpControlsSection displayId={displayId} controls={controls!.color} />
            </Collapsible>
          )}
          {hasAudio && (
            <Collapsible title={t("controls.audio")} icon={Volume2}>
              <VcpControlsSection displayId={displayId} controls={controls!.audio} />
            </Collapsible>
          )}
          {hasInput && (
            <Collapsible title={t("controls.inputAndPower")} icon={Plug}>
              <VcpControlsSection displayId={displayId} controls={controls!.input} />
            </Collapsible>
          )}
        </>
      )}
    </div>
  );
}
