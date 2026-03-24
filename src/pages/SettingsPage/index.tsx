import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Settings className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mt-5 text-base font-medium">{t("settings.inDevelopment")}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("settings.inDevelopmentHint")}</p>
      </div>
    </div>
  );
}
