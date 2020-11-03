import React from "react";
import { connect } from "react-redux";
import { getArtist, updateArtist, closeArtist } from "Actions";
import ArtistInfo from "./ArtistInfo.component";

const mapStateToProps = state => ({
    artist: state.artist.activeArtist
});

const mapDispatchToProps = dispatch => ({
    getArtist: artist => { dispatch(getArtist(artist)) },
    updateArtist: artist => { dispatch(updateArtist(artist)) },
    handleCloseClick: () => { dispatch(closeArtist()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistInfo);
