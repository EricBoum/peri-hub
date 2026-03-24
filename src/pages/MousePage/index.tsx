import { useTranslation } from "react-i18next";
import { Mouse, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/DeviceProvider";
import { MouseCard } from "./MouseCard";

export function MousePage() {
  const { mice, loading, refresh } = useDeviceContext();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("mouse.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("mouse.detected", { count: mice.length })}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            loading && "opacity-50"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {t("common.refresh")}
        </button>
      </div>

      {mice.length > 0 ? (
        <div className="grid gap-4">
          {mice.map((mouse) => (
            <MouseCard key={`${mouse.vendor_id}-${mouse.product_id}`} mouse={mouse} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Mouse className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-5 text-base font-medium">{t("mouse.noMouse")}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("mouse.noMouseHint")}</p>
        </div>
      )}
    </div>
  );
}
