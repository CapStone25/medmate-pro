import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import tr from "./locales/tr.json";
import ja from "./locales/ja.json";
import pt from "./locales/pt.json";

export const languages = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "ja", label: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "pt", label: "Português", flag: "🇵🇹", dir: "ltr" },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      tr: { translation: tr },
      ja: { translation: ja },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "rxvault_language",
    },
  });

export default i18n;
