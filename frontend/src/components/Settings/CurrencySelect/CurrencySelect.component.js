import React from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import "./CurrencySelect.scss"

const CurrencySelect = () => {
  const { t } = useTranslation()
  const currency = useAppStore(state => state.currency)
  const setCurrency = useAppStore(state => state.setCurrency)

  return (
    <div className="currency-select">
      <div className="currency-label">{t("settings.currency")}</div>
      <select
        value={currency}
        onChange={e => {
          setCurrency(e.target.value)
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
