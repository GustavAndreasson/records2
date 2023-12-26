import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Popup from "Components/Popup"
import Artists from "Components/Artists"
import Listen from "./Listen"
import "./RecordInfo.scss"

const RecordInfo = ({
  rec,
  recordsLoading,
  rate,
  currency,
  updateRecord,
  handleYearClick,
  handleListenClick,
  hideRecord,
}) => {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    if (rec) {
      let threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      if (!rec.updated || rec.updated < threeMonthsAgo.toISOString()) {
        updateRecord(rec)
      }
    }
  }, [rec])

  return (
    rec && (
      <>
        <Popup
          name="recordInfo"
          icon={{ icon: "fas fa-record-vinyl" }}
          title={rec.name}
          scrolling={true}
          loading={recordsLoading.includes(rec.id)}
          hide={hideRecord}
        >
          <div className={"record-info"}>
            <img className="cover" src={rec.cover} />
            <div className="artists">
              <Artists artists={rec.artists} />
            </div>
            <div className="left">
              {rec.format && (
                <div className="format">
                  {rec.format
                    .split(" ")
                    .filter((f, i, a) => a.indexOf(f) === i && f !== "All-Media")
                    .map(f => t("format." + f, f))
                    .join(" ")}
                </div>
              )}
              {(rec.year && (
                <div className="year" onClick={() => handleYearClick(rec.year)}>
                  {rec.year}
                </div>
              )) ||
                null}
              {rec.genres && <div className="genres">{rec.genres.join(", ")}</div>}
              {rec.price && rate && (
                <div className="price">
                  {"(" + (rec.price * rate).toFixed(2) + " " + currency + ")"}
                </div>
              )}
              <div className="tracks">
                {rec.tracks &&
                  rec.tracks.map((track, index) => (
                    <div className="track" key={index}>
                      <span className="position">{track.position}</span> {track.name}
                      {track.artists && (
                        <>
                          {" ("}
                          <Artists artists={track.artists} />
                          {")"}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="right">
              {rec.listens &&
                rec.listens.map((listen, index) => (
                  <div className="listen-link" key={index}>
                    <button type="button">
                      <img src={listen.icon} onClick={() => handleListenClick(listen)} />
                    </button>
                    {listen.name || listen.type}
                  </div>
                ))}
            </div>
          </div>
        </Popup>
        <Listen />
      </>
    )
  )
}

export default RecordInfo
