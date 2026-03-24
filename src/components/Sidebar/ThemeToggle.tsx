import { useTranslation } from "react-i18next";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: t("theme.light") },
    { value: "dark" as const, icon: Moon, label: t("theme.dark") },
    { value: "system" as const, icon: Laptop, label: t("theme.system") },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-sidebar-accent/50 p-1">
      {themeOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150",
            theme === opt.value
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
          )}
        >
          <opt.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
