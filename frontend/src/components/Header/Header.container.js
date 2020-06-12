import React from "react";
import { connect } from "react-redux";
import Header from "./Header.component";

const mapStateToProps = state => ({
    showControls: !!(state.collection.discogsUsername || (state.artist.activeArtist && state.artist.viewArtistCollection))
});

export default connect(mapStateToProps)(Header);
