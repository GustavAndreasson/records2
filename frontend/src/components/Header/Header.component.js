import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import Search from "./Search"
import FiltersButton from "./FiltersButton"
import OrdersButton from "./OrdersButton"
import UpdateButton from "./UpdateButton"
import SettingsButton from "./SettingsButton"
import ArtistViewButton from "./ArtistViewButton"
import CollectionStats from "./CollectionStats"
import "./Header.scss"

const Header = () => {
  const [showSearch, setShowSearch] = useState(false)
  const toggleShowSearch = () => setShowSearch(!showSearch)
  const { t } = useTranslation()
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const showControls = Boolean(discogsUsername || (activeArtist && viewArtistCollection))

  return (
    <header>
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
    </header>
  )
}

export default Header
