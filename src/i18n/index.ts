import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

const STORAGE_KEY = "peri-hub-lang";

const getInitialLang = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "system" || !stored) {
    return navigator.language.startsWith("zh") ? "zh" : "en";
  }
  return stored;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: getInitialLang(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
