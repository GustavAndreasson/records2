import React from "react"
import LazyLoad from "react-lazyload"
import { Artists, Formats, Genres, Price, Year } from "Components/Attributes"
import { fixArtistName } from "Utils/Helpers"
import "./Record.scss"

const Record = ({ rec, gridView, gridColumns, handleClick }) => {
  const attributes = {
    artists: Artists,
    formats: Formats,
    genres: Genres,
    price: Price,
    year: Year,
  }
  const artists = rec.artists
    .map(
      (artist, index) =>
        (artist.anv || fixArtistName(artist.artist.name)) +
        (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
    )
    .join(" ")
  const format_classes = rec.formats
    ? rec.formats.map(f => "format-" + f.name.replace(/[^0-9a-zA-Z\-]/g, "_")).join(" ")
    : "format-none"

  return gridView ? (
    <div className="record-row" onClick={() => handleClick(rec)}>
      <div className="record-image">
        <LazyLoad offset={300} once>
          <img
            className="cover"
            src={rec.thumbnail}
            alt={artists + " - " + rec.name}
            title={artists + " - " + rec.name}
          />
        </LazyLoad>
      </div>
      {gridColumns &&
        gridColumns.map(column => {
          const Attribute = attributes[column]
          return (
            <div className={`record-${column}`} key={column}>
              {Attribute ? <Attribute value={rec[column]} /> : column in rec && rec[column]}
            </div>
          )
        })}
    </div>
  ) : (
    <div className={`record ${format_classes}`} onClick={() => handleClick(rec)}>
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
