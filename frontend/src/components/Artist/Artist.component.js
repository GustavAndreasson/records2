import React from "react"
import "./Artist.scss"

const Artist = ({ artist, handleClick, active = true }) => (
  <span
    className={"artist" + (!active ? " inactive" : "")}
    onClick={e => {
      e.stopPropagation()
      handleClick(artist)
    }}
  >
    {artist.name}
  </span>
)

export default Artist
