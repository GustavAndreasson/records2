import React from "react"
import { fixArtistName } from "Utils/Helpers"
import "./Artist.scss"

const Artist = ({ artist, anv = "", handleClick, active = true }) => (
  <span
    className={"artist" + (!active ? " inactive" : "")}
    onClick={e => {
      e.stopPropagation()
      handleClick(artist)
    }}
  >
    {anv || fixArtistName(artist.name)}
  </span>
)

export default Artist
