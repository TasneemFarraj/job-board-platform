import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export const RTL_LANGUAGES = ["ar"];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: localStorage.getItem("jobbr-lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function applyDocumentDirection(lang: string) {
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
}

i18n.on("languageChanged", (lang) => {
  applyDocumentDirection(lang);
  localStorage.setItem("jobbr-lang", lang);
});

applyDocumentDirection(i18n.language);

export default i18n;
