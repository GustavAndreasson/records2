import React from "react";

const RecordPopup = ({ rec }) => {
    console.log(rec);
    return (rec &&
        <div className="record-popup">
            <img className="cover" src={rec.cover} />
            <div className="left">
                <div className="artists">{rec.artists[0].artist.name}</div>
                <div className="name">{rec.name}</div>
                <div className="format">{rec.format}</div>
                <div className="year">{rec.year}</div>
                <div className="tracks">
                    {rec.tracks && rec.tracks.map((track) => (
                        <div className="track" key={track.position}>
                            <span className="position">{track.position}</span> {track.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default RecordPopup;
