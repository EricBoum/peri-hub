import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisplayModeInfo } from "@/types/device";

function resKey(m: { width: number; height: number; is_hidpi: boolean }) {
  return `${m.width}x${m.height}:${m.is_hidpi ? "hidpi" : "low"}`;
}

interface ResOption {
  key: string;
  label: string;
  width: number;
  height: number;
  is_hidpi: boolean;
}

type ResCategory = "hidpi" | "low";

export function ResolutionPanel({ displayId }: { displayId: number }) {
  const { t } = useTranslation();
  const [modes, setModes] = useState<DisplayModeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ResCategory>("hidpi");

  useEffect(() => {
    setLoading(true);
    invoke<DisplayModeInfo[]>("get_display_modes", { displayId })
      .then((result) => {
        setModes(result);
        const current = result.find((m) => m.is_current);
        if (current) {
          setSelectedKey(resKey(current));
          setSelectedRate(current.refresh_rate);
          setActiveTab(current.is_hidpi ? "hidpi" : "low");
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [displayId]);

  const { hidpiList, lowList } = useMemo(() => {
    const seen = new Set<string>();
    const hidpi: ResOption[] = [];
    const low: ResOption[] = [];
    for (const m of modes) {
      const k = resKey(m);
      if (seen.has(k)) continue;
      seen.add(k);
      const item: ResOption = {
        key: k,
        label: `${m.width} × ${m.height}`,
        width: m.width,
        height: m.height,
        is_hidpi: m.is_hidpi,
      };
      if (m.is_hidpi) hidpi.push(item);
      else low.push(item);
    }
    return { hidpiList: hidpi, lowList: low };
  }, [modes]);

  const activeList = activeTab === "hidpi" ? hidpiList : lowList;
  const selectedRes = [...hidpiList, ...lowList].find(
    (r) => r.key === selectedKey
  );

  const refreshRates = useMemo(() => {
    if (!selectedRes) return [];
    const seen = new Set<number>();
    return modes
      .filter(
        (m) =>
          m.width === selectedRes.width &&
          m.height === selectedRes.height &&
          m.is_hidpi === selectedRes.is_hidpi
      )
      .map((m) => Math.round(m.refresh_rate))
      .filter((r) => {
        if (seen.has(r)) return false;
        seen.add(r);
        return true;
      })
      .sort((a, b) => b - a);
  }, [modes, selectedRes]);

  const currentMode = modes.find((m) => m.is_current);
  const currentKey = currentMode ? resKey(currentMode) : null;
  const currentRate = currentMode ? Math.round(currentMode.refresh_rate) : null;
  const hasChanges = selectedKey !== currentKey || selectedRate !== currentRate;

  const handleResChange = (key: string) => {
    setSelectedKey(key);
    const res = [...hidpiList, ...lowList].find((r) => r.key === key);
    if (!res) return;
    const seen = new Set<number>();
    const rates = modes
      .filter(
        (m) =>
          m.width === res.width &&
          m.height === res.height &&
          m.is_hidpi === res.is_hidpi
      )
      .map((m) => Math.round(m.refresh_rate))
      .filter((r) => {
        if (seen.has(r)) return false;
        seen.add(r);
        return true;
      })
      .sort((a, b) => b - a);
    setSelectedRate(rates[0] ?? null);
  };

  const handleApply = async () => {
    if (!selectedRes || selectedRate === null) return;
    setApplying(true);
    setError(null);
    try {
      await invoke("set_display_mode", {
        params: {
          display_id: displayId,
          width: selectedRes.width,
          height: selectedRes.height,
          refresh_rate: selectedRate,
          is_hidpi: selectedRes.is_hidpi,
        },
      });
      const result = await invoke<DisplayModeInfo[]>("get_display_modes", {
        displayId,
      });
      setModes(result);
      const newCurrent = result.find((m) => m.is_current);
      if (newCurrent) {
        setSelectedKey(resKey(newCurrent));
        setSelectedRate(Math.round(newCurrent.refresh_rate));
        setActiveTab(newCurrent.is_hidpi ? "hidpi" : "low");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("monitor.loadingModes")}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {t("monitor.resolutionAndRefreshRateHint")}
      </p>

      <div>
        <label className="mb-3 block text-sm font-medium">
          {t("monitor.resolution")}
        </label>
        <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("hidpi")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "hidpi"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("monitor.retinaHiDPI")}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {hidpiList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("low")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === "low"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("monitor.lowResolution")}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {lowList.length}
            </span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {activeList.map((res) => (
            <button
              key={res.key}
              onClick={() => handleResChange(res.key)}
              className={cn(
                "relative rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                selectedKey === res.key
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background hover:border-muted-foreground/30"
              )}
            >
              <span className="font-medium">{res.label}</span>
              {selectedKey === res.key && (
                <Check className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {refreshRates.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            {t("monitor.refreshRate")}
          </label>
          <div className="flex flex-wrap gap-2">
            {refreshRates.map((rate) => (
              <button
                key={rate}
                onClick={() => setSelectedRate(rate)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm transition-colors",
                  selectedRate === rate
                    ? "border-primary bg-primary/5 font-medium text-foreground"
                    : "border-border bg-background hover:border-muted-foreground/30"
                )}
              >
                {rate} Hz
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleApply}
          disabled={!hasChanges || applying}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            (!hasChanges || applying) && "cursor-not-allowed opacity-50"
          )}
        >
          {applying && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("common.apply")}
        </button>
        {hasChanges && (
          <span className="text-xs text-muted-foreground">
            {t("monitor.unsavedChanges")}
          </span>
        )}
      </div>
    </div>
  );
}
