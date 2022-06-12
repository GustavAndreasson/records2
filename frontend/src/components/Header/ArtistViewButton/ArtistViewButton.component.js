import React from "react"

const ArtistViewButton = ({
  artist,
  discogsUsername,
  viewArtistCollection,
  collectionLoading,
  handleShowCollectionClick,
}) =>
  artist &&
  discogsUsername && (
    <button
      type="button"
      className={"fas " + (viewArtistCollection ? "fa-list" : "fa-guitar")}
      disabled={collectionLoading}
      onClick={handleShowCollectionClick}
    ></button>
  )

export default ArtistViewButton
