import React from "react";
import { connect } from 'react-redux';
import { showArtist } from '../actions';
import "./styling/Artist.scss";

const mapDispatchToProps = dispatch => ({
    handleClick: artist => { dispatch(showArtist(artist)) }
});

const Artist = ({ artist, handleClick, active=true }) =>
    <span className={"artist" + (!active ? " inactive" : "")} onClick={() => handleClick(artist)}>{artist.name}</span>

export default connect(null, mapDispatchToProps)(Artist);
