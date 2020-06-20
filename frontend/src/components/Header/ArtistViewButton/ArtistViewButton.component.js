import React from "react";

const ArtistViewButton = ({
    artist,
    viewArtistCollection,
    collectionLoading,
    handleShowCollectionClick
}) => (artist &&
    <button type="button"
        className={"fas " + (viewArtistCollection ? "fa-list" : "fa-guitar")}
        disabled={collectionLoading}
        onClick={handleShowCollectionClick}>
    </button>
);

export default ArtistViewButton;
