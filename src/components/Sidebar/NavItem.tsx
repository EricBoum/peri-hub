import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavItem({
  to,
  label,
  icon: Icon,
  isActive,
  badge,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-sidebar-accent-foreground"
            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
        )}
      />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
            isActive
              ? "bg-sidebar-background/30 text-sidebar-accent-foreground"
              : "bg-sidebar-accent/50 text-sidebar-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
}
