import React from "react";
import { connect } from "react-redux";
import { openArtist, viewArtistCollection, getArtistCollection } from "Actions";
import ArtistInput from "./ArtistInput.component";

const mapDispatchToProps = dispatch => ({
    handleSetArtist: artist => {
        dispatch(openArtist(artist))
        dispatch(viewArtistCollection(true))
        dispatch(getArtistCollection(artist))
    }
});

export default connect(null, mapDispatchToProps)(ArtistInput);
