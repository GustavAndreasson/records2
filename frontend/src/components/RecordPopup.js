import React from "react";

const RecordPopup = ({ rec }) => {
    console.log(rec);
    return (rec &&
        <div className="record-popup">
            <img className="cover" src={rec.image} />
            <div className="left">
                <div className="artists">{rec.artists[0].artist.name}</div>
                <div className="name">{rec.name}</div>
                <div className="format">{rec.format}</div>
                <div className="year">{rec.year}</div>
                <div className="tracks"></div>
            </div>
        </div>
    );
}
export default RecordPopup;
