import { useLocation } from "react-router-dom";
import { Monitor, Mouse, Settings, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavItem } from "./NavItem";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { to: "/monitor", label: t("sidebar.monitor"), icon: Monitor },
    { to: "/mouse", label: t("sidebar.mouse"), icon: Mouse },
  ];

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-accent">
          <Cpu className="h-4 w-4 text-sidebar-primary" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-primary">
          {t("app.name")}
        </span>
      </div>

      <nav className="flex-1 px-3 pt-4 pb-2">
        <div className="space-y-1">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            {t("sidebar.devices")}
          </p>
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>
      </nav>

      <div className="space-y-2 border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs text-sidebar-foreground/50">{t("sidebar.theme")}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between px-3">
          <span className="text-xs text-sidebar-foreground/50">{t("sidebar.language")}</span>
          <LanguageToggle />
        </div>
        <NavItem
          to="/settings"
          label={t("sidebar.settings")}
          icon={Settings}
          isActive={location.pathname === "/settings"}
        />
      </div>
    </aside>
  );
}
