import React from "react";
import { connect } from "react-redux";
import { getCollection, getArtist, getArtistCollection } from "Actions";
import App from "./App.component";

const mapStateToProps = state => ({
    discogsUsername: state.collection.discogsUsername,
    activeArtist: state.artist.activeArtist,
    viewArtistCollection: state.artist.viewArtistCollection
});

const mapDispatchToProps = dispatch => ({
    getCollection: user => { dispatch(getCollection(user)) },
    getArtist: artist => { dispatch(getArtist(artist)) },
    getArtistCollection: artist => { dispatch(getArtistCollection(artist)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
