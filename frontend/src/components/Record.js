import React from "react";

const Record = ({ rec, handleClick }) => {
    let artists = rec.artists.map((artist, index) => artist.artist.name + (index < rec.artists.length ? " " + artist.delimiter : "")).join(" ");
    let formats = "format-" + rec.format.replace(/ /, " format-");

    return (
        <div className="record" onClick={() => handleClick(rec)}>
            <img className={`cover ${formats}`} src={rec.thumbnail}
                alt={artists + " - " + rec.name}
                title={artists + " - " + rec.name} />
        </div>
    );
}
export default Record;
