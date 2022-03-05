import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelect.scss";

const LanguageSelect = () => {
  const { t, i18n } = useTranslation();
  const handleUpdateLanguage = l => {
    i18n.changeLanguage(l);
  }
  return (
    <div className="language-select">
      <div className="language-label">{t('settings.language')}</div>
      <select value={i18n.resolvedLanguage} onChange={e => {handleUpdateLanguage(e.target.value)}}>
        <option value="sv">{t('settings.lang.sv')}</option>
        <option value="en">{t('settings.lang.en')}</option>
      </select>
    </div>
  );
}

export default LanguageSelect;
