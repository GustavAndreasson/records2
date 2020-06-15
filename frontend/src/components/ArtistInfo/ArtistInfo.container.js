import React from "react";
import { connect } from "react-redux";
import { closeArtist, toggleViewArtistCollection } from "Actions";
import ArtistInfo from "./ArtistInfo.component";

const mapStateToProps = state => ({
    artist: state.artist.activeArtist,
    viewArtistCollection: state.artist.viewArtistCollection,
    collectionLoading: state.ui.collectionLoading
});

const mapDispatchToProps = dispatch => ({
    handleCloseClick: () => { dispatch(closeArtist()) },
    handleShowCollectionClick: () => { dispatch(toggleViewArtistCollection()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistInfo);
