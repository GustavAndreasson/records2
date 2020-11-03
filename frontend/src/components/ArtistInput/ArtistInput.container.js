import React from "react";
import { connect } from "react-redux";
import { showArtist } from "Actions";
import ArtistInput from "./ArtistInput.component";

const mapDispatchToProps = dispatch => ({
    handleSetArtist: artist => { dispatch(showArtist(artist)) }
});

export default connect(null, mapDispatchToProps)(ArtistInput);
