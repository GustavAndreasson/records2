import React from "react";
import "./styling/Record.scss";

const Record = ({ rec, handleClick }) => {
    let artists = rec.artists.map((artist, index) => artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")).join(" ");
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
