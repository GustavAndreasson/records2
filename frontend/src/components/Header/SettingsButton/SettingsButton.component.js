import React from "react"
import { useAppStore } from "Store"

const SettingsButton = () => {
  const showPopup = useAppStore(state => state.showPopup)
  return (
    <button
      type="button"
      className="fas fa-cog"
      onClick={() => showPopup("settings")}
    ></button>
  )
}

export default SettingsButton
