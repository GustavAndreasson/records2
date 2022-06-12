import React from "react"
import { useTranslation } from "react-i18next"
import "./CurrencySelect.scss"

const CurrencySelect = ({ currency, handleUpdateCurrency }) => {
  const { t, i18n } = useTranslation()
  return (
    <div className="currency-select">
      <div className="currency-label">{t("settings.currency")}</div>
      <select
        value={currency}
        onChange={e => {
          handleUpdateCurrency(e.target.value)
        }}
      >
        <option value="SEK">SEK</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </div>
  )
}

export default CurrencySelect
