import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import "./UsernameInput.scss"

const UsernameInput = () => {
  const { t } = useTranslation()
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const setDiscogsUsername = useAppStore(state => state.setDiscogsUsername)
  const [user, setUser] = useState(discogsUsername)
  const handleSubmit = e => {
    e.preventDefault()
    setDiscogsUsername(user)
  }
  return (
    <form className="username-input" onSubmit={handleSubmit}>
      <i className="fas fa-user"></i>
      <input
        type="text"
        placeholder={t("settings.username")}
        value={user}
        onChange={e => setUser(e.target.value)}
      />
      <button type="submit" disabled={!user.length}>
        {t("common.ok")}
      </button>
    </form>
  )
}

export default UsernameInput
