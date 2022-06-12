import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import en from "./en.json"
import sv from "./sv.json"

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ["querystring", "localStorage", "sessionStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
    },
    resources: {
      en: { translations: en },
      sv: { translations: sv },
    },
    fallbackLng: "sv",
    //lng: language,
    // debug only when not in production
    debug: process.env.NODE_ENV !== "production",
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      useSuspense: true,
    },
  })

export default i18n
