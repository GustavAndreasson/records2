import React from "react";

const Record = ({ rec, handleClick }) => {
    const getArtists = (html) => html ?
        rec.artists[0].artist.name :
        rec.artists[0].artist.name;

    const getFormats = () => rec.format.replace(/ /, " format-");
    
    return (
            <div class="record" onclick={handleClick}>
            <img class={'cover ${getFormats()}'} src={rec.thumbnail}
            alt={getArtists(false) + " - " + rec.name}
            title={getArtists(false) + " - " + rec.name} />
        </div>
    );
}
export default Record;
