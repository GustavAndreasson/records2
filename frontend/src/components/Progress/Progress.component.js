import React from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import { useCollectionQuery, useArtistCollectionQuery, useProgressQuery } from "Queries"
import "./Progress.scss"

const Progress = () => {
  const { t } = useTranslation()
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const storeProgress = useAppStore(state => state.progress)
  const storeStatus = useAppStore(state => state.status)

  const { isFetching: isCollectionFetching, isError: isCollectionError } = useCollectionQuery(discogsUsername)
  const { isFetching: isArtistFetching, isError: isArtistError } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )

  const collectionLoading = viewArtistCollection ? isArtistFetching : isCollectionFetching
  const isError = viewArtistCollection ? isArtistError : isCollectionError

  const { data: progressData } = useProgressQuery(collectionLoading)

  const progress = progressData && Object.keys(progressData).length > 0 ? progressData : storeProgress
  const status = isError
    ? "Något gick fel..."
    : collectionLoading
    ? "Hämtar skivor..."
    : storeStatus

  return (
    collectionLoading &&
    progress && (
      <div className="progress">
        {status && <div className="progress-title">{status}</div>}
        {Object.keys(progress).length ? (
          Object.keys(progress).map(key => (
            <div className="progress-bar" key={key}>
              <div className="progress-label">{t("progress." + key)}</div>
              <div className="progress-meter" style={{ width: progress[key] + "%" }}></div>
              <div className="progress-value">{progress[key] + "%"}</div>
            </div>
          ))
        ) : (
          <div className="progress-bar">
            <div className="progress-auto-meter"></div>
          </div>
        )}
      </div>
    )
  )
}

export default Progress
