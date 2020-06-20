import React from "react";
import { connect } from "react-redux";
import { closeArtist } from "Actions";
import ArtistInfo from "./ArtistInfo.component";

const mapStateToProps = state => ({
    artist: state.artist.activeArtist
});

const mapDispatchToProps = dispatch => ({
    handleCloseClick: () => { dispatch(closeArtist()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistInfo);
