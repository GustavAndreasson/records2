import React from "react"
import { useAppStore } from "Store"
import { useArtistCollectionQuery, useCollectionQuery } from "Queries"

const ArtistViewButton = () => {
  const artist = useAppStore(state => state.activeArtist)
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const toggleViewArtistCollection = useAppStore(state => state.toggleViewArtistCollection)

  const { isFetching: isCollectionFetching } = useCollectionQuery(discogsUsername)
  const { isFetching: isArtistFetching } = useArtistCollectionQuery(artist?.id)
  const collectionLoading = viewArtistCollection ? isArtistFetching : isCollectionFetching

  if (!artist || !discogsUsername) return null

  return (
    <button
      type="button"
      className={"fas " + (viewArtistCollection ? "fa-list" : "fa-guitar")}
      disabled={collectionLoading}
      onClick={toggleViewArtistCollection}
    ></button>
  )
}

export default ArtistViewButton
