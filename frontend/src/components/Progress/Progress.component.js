import React from "react"
import { useTranslation } from "react-i18next"
import { useIsMutating } from "@tanstack/react-query";
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
  const isCollectionMutating = useIsMutating({ mutationKey: ["collection"]}) > 0
  const isArtistCollectionMutating = useIsMutating({ mutationKey: ["artistCollection"]}) > 0

  const collectionFetching = viewArtistCollection
      ? isArtistFetching
      : isCollectionFetching
  const collectionMutating = viewArtistCollection
      ? isArtistCollectionMutating
      : isCollectionMutating

  const isError = viewArtistCollection ? isArtistError : isCollectionError

  const { data: progressData } = useProgressQuery(collectionMutating)

  const progress = progressData && Object.keys(progressData).length > 0 ? progressData : storeProgress
  const status = isError
    ? "Något gick fel..."
    : (collectionFetching || collectionMutating)
    ? "Hämtar skivor..."
    : storeStatus

  return (
    (collectionFetching || collectionMutating) &&
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
