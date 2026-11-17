import React, { useEffect } from "react"
import { useAppStore } from "Store"
import { useCollectionQuery, useArtistCollectionQuery, useRecordQuery, useRecordMutation, useRateQuery } from "Queries"
import { getActiveRecord } from "Store/selectors"
import Popup from "Components/Popup"
import { Artists, Formats, Genres, Price, Year } from "Components/Attributes"
import Listen from "./Listen"
import "./RecordInfo.scss"

const RecordInfo = () => {
  const activeRecordId = useAppStore(state => state.activeRecord)
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const recordsLoading = useAppStore(state => state.recordsLoading)
  const currency = useAppStore(state => state.currency)
  const hideRecord = useAppStore(state => state.hideRecord)
  const showListen = useAppStore(state => state.showListen)

  const { data: collection } = useCollectionQuery(discogsUsername)
  const { data: artistCollection } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )
  const { data: recordDetails, isFetching: isRecordFetching } = useRecordQuery(activeRecordId)
  const { data: rate = 1 } = useRateQuery(currency)
  const updateRecordMutation = useRecordMutation(activeRecordId)

  const cachedRecord = getActiveRecord(collection, artistCollection, viewArtistCollection, activeRecordId)
  const rec = recordDetails || cachedRecord

  useEffect(() => {
    if (rec && rec.id) {
      let threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      if (!rec.updated || rec.updated < threeMonthsAgo.toISOString()) {
        updateRecordMutation.mutate(rec.id)
      }
    }
  }, [rec?.id, rec?.updated])

  const isLoading =
    isRecordFetching ||
    updateRecordMutation.isLoading ||
    (activeRecordId && recordsLoading.includes(activeRecordId))

  return (
    rec && (
      <>
        <Popup
          name="recordInfo"
          icon={{ icon: "fas fa-record-vinyl" }}
          title={rec.name}
          scrolling={true}
          loading={Boolean(isLoading)}
          hide={hideRecord}
        >
          <div className={"record-info"}>
            <img className="cover" src={rec.cover} alt={rec.name} />
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
              <a
                className="discogs-link"
                target="_blank"
                rel="noreferrer"
                href={"https://www.discogs.com/release/" + rec.id}
              >
                Discogs
              </a>
              {rec.listens &&
                rec.listens.map((listen, index) => (
                  <div className="listen-link" key={index}>
                    <button type="button" onClick={() => showListen(listen)}>
                      <img src={listen.icon} alt={listen.name || listen.type} />
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
