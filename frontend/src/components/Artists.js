import React, { Fragment } from "react";

const Artists = ({ artists, html }) => {
    return (
	artists && artists.map((artist, index) => {
	    <Fragment>
		{ html ? <span className="artist">{artist.artist.name}</span> : artist.artist.name; }
	        { index < artists.length && " " + artist.delimiter }
	    </Fragment>
	}
    )
}
export default Artists;
