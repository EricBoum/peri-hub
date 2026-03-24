import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "@/types/i18n";

const STORAGE_KEY = "peri-hub-lang";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const [current, setCurrent] = useState<AppLanguage>(
    () => (localStorage.getItem(STORAGE_KEY) as AppLanguage) || "system"
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      if (current === "system") {
        const sysLang = navigator.language.startsWith("zh") ? "zh" : "en";
        i18n.changeLanguage(sysLang);
      }
    };
    
    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, [current, i18n]);

  const setLang = (lang: AppLanguage) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setCurrent(lang);
    if (lang === "system") {
      const sysLang = navigator.language.startsWith("zh") ? "zh" : "en";
      i18n.changeLanguage(sysLang);
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const options = [
    { value: "zh" as const, label: "中" },
    { value: "en" as const, label: "En" },
    { value: "system" as const, label: "", icon: Globe },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-sidebar-accent/50 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          title={opt.value === "system" ? "System" : opt.label}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-all duration-150",
            current === opt.value
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
          )}
        >
          {opt.icon ? <opt.icon className="h-3.5 w-3.5" /> : opt.label}
        </button>
      ))}
    </div>
  );
}
