import React, { Fragment } from "react";

const Artists = ({ artists, handleClick }) => {
    return (
        artists && artists.map((artist, index) => (
            <Fragment key={artist.artist.id}>
                <span className="artist" onClick={() => handleClick(artist.artist)}>{artist.artist.name}</span>
                { index < artists.length && " " + artist.delimiter + " " }
            </Fragment>
        ))
    )
}
export default Artists;
