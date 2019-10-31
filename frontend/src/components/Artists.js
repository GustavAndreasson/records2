import React, { Fragment } from "react";
import Artist from "./Artist.js";

const Artists = ({ artists, handleClick }) => {
    return (
        artists && artists.map((artist, index) => (
            <Fragment key={artist.artist.id}>
                <Artist artist={artist.artist} handleClick={handleClick} />
                { index < artists.length - 1 && " " + artist.delimiter + " " }
            </Fragment>
        ))
    )
}
export default Artists;
