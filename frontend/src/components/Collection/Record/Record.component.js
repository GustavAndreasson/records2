import React from "react"
import { useTranslation } from "react-i18next"
import LazyLoad from "react-lazyload"
import Artists from "Components/Artists"
import "./Record.scss"

const Record = ({ rec, gridView, gridColumns, rate, handleClick, handleYearClick }) => {
  const { t, i18n } = useTranslation()
  const artists = rec.artists
    .map(
      (artist, index) =>
        artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
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
            ) : column == "formats" ? (
              rec.formats &&
              rec.formats
                .filter(f => f.name !== "All-Media")
                .map(f => (f.qty > 1 ? f.qty + "x" : "") + t("format." + f.name, f.name))
                .join(", ")
            ) : column == "genres" ? (
              rec.genres && rec.genres.join(", ")
            ) : (
              column in rec && rec[column]
            )}
          </div>
        ))}
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
