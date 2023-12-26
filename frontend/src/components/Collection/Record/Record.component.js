import React from "react"
import { useTranslation } from "react-i18next"
import LazyLoad from "react-lazyload"
import Artists from "Components/Artists"
import "./Record.scss"

const Record = ({ rec, gridView, gridColumns, rate, handleClick, handleYearClick }) => {
  const { t, i18n } = useTranslation()
  let artists = rec.artists
    .map(
      (artist, index) =>
        artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
    )
    .join(" ")
  let formats = rec.format ? "format-" + rec.format.replace(/ /, " format-") : "format-none"

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
        gridColumns.map(column => (
          <div className={`record-${column}`} key={column}>
            {column == "artist" ? (
              <Artists artists={rec.artists} />
            ) : column == "price" ? (
              rec.price && (rec.price * rate).toFixed(2)
            ) : column == "year" ? (
              rec.year ? (
                <span
                  className="year"
                  onClick={e => {
                    e.stopPropagation()
                    handleYearClick(rec.year)
                  }}
                >
                  {rec.year}
                </span>
              ) : null
            ) : column == "format" ? (
              rec.format &&
              rec.format
                .split(" ")
                .filter((f, i, a) => a.indexOf(f) === i && f !== "All-Media")
                .map(f => t("format." + f, f))
                .join(" ")
            ) : column == "genres" ? (
              rec.genres && rec.genres.join(", ")
            ) : (
              column in rec && rec[column]
            )}
          </div>
        ))}
    </div>
  ) : (
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
