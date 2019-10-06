import React from "react";

const Record = ({ rec, handleClick }) => {
    let artists = rec.artists.map((artist, index) => (index > 0 ? " " + artist.delimiter : "") + artist.artist.name).join(" ");
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
