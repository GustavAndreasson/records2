import React, { Fragment } from "react";
import Artist from "./Artist.js";

const Artists = ({ artists }) => (
    artists && artists.map((artist, index) => (
        <Fragment key={artist.artist.id}>
            <Artist artist={artist.artist} />
            { index < artists.length - 1 && " " + artist.delimiter + " " }
        </Fragment>
    ))
)
export default Artists;
