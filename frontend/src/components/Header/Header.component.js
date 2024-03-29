import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Search from "./Search"
import FiltersButton from "./FiltersButton"
import OrdersButton from "./OrdersButton"
import UpdateButton from "./UpdateButton"
import SettingsButton from "./SettingsButton"
import ArtistViewButton from "./ArtistViewButton"
import CollectionStats from "./CollectionStats"
import "./Header.scss"

const Header = ({ showControls }) => {
  const [showSearch, setShowSearch] = useState(false)
  const toggleShowSearch = () => setShowSearch(!showSearch)
  const { t, i18n } = useTranslation()
  const headerContent = (
    <>
      <h1>{t("header.title")}</h1>
      {showControls && (
        <>
          <Search showSearch={showSearch} toggleShowSearch={toggleShowSearch} />
          <div className="buttons">
            <FiltersButton />
            <OrdersButton />
            <UpdateButton />
            <SettingsButton />
            <ArtistViewButton />
          </div>
          <CollectionStats />
        </>
      )}
    </>
  )
  return (
    <>
      <header>{headerContent}</header>
      <div className="header-push">{headerContent}</div>
    </>
  )
}

export default Header
