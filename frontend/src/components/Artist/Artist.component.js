import React from "react"
import { useAppStore } from "Store"
import { fixArtistName } from "Utils/Helpers"
import "./Artist.scss"

const Artist = ({ artist, anv = "", handleClick, active = true }) => {
  const showArtist = useAppStore(state => state.showArtist)
  const onClickHandler = handleClick || showArtist

  return (
    <span
      className={"artist" + (!active ? " inactive" : "")}
      onClick={e => {
        e.stopPropagation()
        onClickHandler(artist)
      }}
    >
      {anv || fixArtistName(artist?.name)}
    </span>
  )
}

export default Artist
