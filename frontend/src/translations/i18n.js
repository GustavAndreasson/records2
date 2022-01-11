import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import sv from './sv.json';

let language = localStorage.getItem('language');

if (language === undefined) {
  language = 'sv';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translations: en },
    sv: { translations: sv },
  },
  fallbackLng: 'sv',
  lng: language,
  // debug only when not in production
  debug: process.env.NODE_ENV !== 'production',
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export default i18n;
