import { useTranslation } from "react-i18next";
import { Mouse } from "lucide-react";
import type { MouseInfo } from "@/types/device";

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

export function MouseCard({ mouse }: { mouse: MouseInfo }) {
  const { t } = useTranslation();
  const vid = mouse.vendor_id.toString(16).toUpperCase().padStart(4, "0");
  const pid = mouse.product_id.toString(16).toUpperCase().padStart(4, "0");

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/30">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Mouse className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-medium">{mouse.product_name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{mouse.manufacturer}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoItem label="VID:PID" value={`${vid}:${pid}`} />
        <InfoItem label={t("mouse.connection")} value={mouse.transport} />
        {mouse.serial_number && (
          <InfoItem label={t("mouse.serialNumber")} value={mouse.serial_number} />
        )}
      </div>
    </div>
  );
}
