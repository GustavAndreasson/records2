import React from "react"
import { useTranslation } from "react-i18next"
import Popup from "Components/Popup"
import UsernameInput from "Components/UsernameInput"
import ArtistInput from "Components/ArtistInput"
import DirectLink from "./DirectLink"
import GridSettings from "./GridSettings"
import CurrencySelect from "./CurrencySelect"
import LanguageSelect from "./LanguageSelect"
import "./Settings.scss"

const Settings = () => {
  const { t, i18n } = useTranslation()
  return (
    <Popup name="settings" icon={{ icon: "fas fa-cog" }} title={t("settings.title")}>
      <div className="settings">
        <DirectLink />
        <UsernameInput />
        <ArtistInput />
        <GridSettings />
        <CurrencySelect />
        <LanguageSelect />
      </div>
    </Popup>
  )
}

export default Settings
