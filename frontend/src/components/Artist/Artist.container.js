import React from "react";
import { connect } from "react-redux";
import { openArtist } from "Actions";
import Artist from "./Artist.component";

const mapDispatchToProps = dispatch => ({
    handleClick: artist => { dispatch(openArtist(artist)) }
});

export default connect(null, mapDispatchToProps)(Artist);
