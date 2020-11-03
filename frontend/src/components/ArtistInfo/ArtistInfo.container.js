import React from "react";
import { connect } from "react-redux";
import { getArtist, updateArtist, hideArtist } from "Actions";
import ArtistInfo from "./ArtistInfo.component";

const mapStateToProps = state => ({
    artist: state.artist.activeArtist
});

const mapDispatchToProps = dispatch => ({
    getArtist: artist => { dispatch(getArtist(artist)) },
    updateArtist: artist => { dispatch(updateArtist(artist)) },
    handleCloseClick: () => { dispatch(hideArtist()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistInfo);
