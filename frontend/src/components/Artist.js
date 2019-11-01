import React from "react";
import "./styling/Artist.scss";

const Artist = ({ artist, handleClick, active=true }) =>
    <span className={"artist" + (!active ? " inactive" : "")} onClick={() => handleClick(artist)}>{artist.name}</span>

export default Artist;
