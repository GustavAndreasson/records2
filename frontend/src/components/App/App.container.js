import React from "react";
import { connect } from "react-redux";
import App from "./App.component";

const mapStateToProps = state => ({
    discogsUsername: state.collection.discogsUsername,
    activeArtist: state.artist.activeArtist,
    viewArtistCollection: state.artist.viewArtistCollection
});

export default connect(mapStateToProps)(App);
