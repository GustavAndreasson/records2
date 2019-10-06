import React, { Fragment } from "react";

const Artists = ({ artists, handleClick }) => {
    return (
        artists && artists.map((artist, index) => (
            <Fragment key={artist.artist.id}>
                { index > 0 && " " + artist.delimiter + " " }
                <span className="artist" onClick={() => handleClick(artist.artist)}>{artist.artist.name}</span>
            </Fragment>
        ))
    )
}
export default Artists;
