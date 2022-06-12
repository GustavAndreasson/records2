import React from "react"
import LazyLoad from "react-lazyload"
import "./Record.scss"

const Record = ({ rec, handleClick }) => {
  let artists = rec.artists
    .map(
      (artist, index) =>
        artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
    )
    .join(" ")
  let formats = rec.format ? "format-" + rec.format.replace(/ /, " format-") : "format-none"

  return (
    <div className={`record ${formats}`} onClick={() => handleClick(rec)}>
      <LazyLoad offset={300} once>
        <img
          className="cover"
          src={rec.thumbnail}
          alt={artists + " - " + rec.name}
          title={artists + " - " + rec.name}
        />
      </LazyLoad>
    </div>
  )
}

export default Record
