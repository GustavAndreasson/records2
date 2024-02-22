import React, { useEffect } from "react"
import Popup from "Components/Popup"
import { Artists, Formats, Genres, Price, Year } from "Components/Attributes"
import Listen from "./Listen"
import "./RecordInfo.scss"

const RecordInfo = ({
  rec,
  recordsLoading,
  rate,
  currency,
  updateRecord,
  handleListenClick,
  hideRecord,
}) => {
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
              <Artists value={rec.artists} />
            </div>
            <div className="left">
              {rec.formats && (
                <div className="formats">
                  <Formats value={rec.formats} />
                </div>
              )}
              {(rec.year || rec.release_year || rec.release_country) && (
                <div className="origin">
                  {(rec.year && <Year value={rec.year} />) || null}
                  {(rec.release_year || rec.release_country) && (
                    <span className="release-info">
                      {"(" +
                        (rec.release_year ? rec.release_year + (rec.release_country && ", ") : "") +
                        (rec.release_country ? rec.release_country : "") +
                        ")"}
                    </span>
                  )}
                </div>
              )}
              {rec.genres && (
                <div className="genres">
                  <Genres value={rec.genres} />
                </div>
              )}
              {rec.price && rate && (
                <div className="price">
                  {"("}
                  <Price value={rec.price} />
                  {" " + currency + ")"}
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
                          <Artists value={track.artists} />
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
