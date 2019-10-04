import React, { Fragment } from "react";

import Artists from "./Artists";

const RecordPopup = ({ rec, handleClick,  handleArtistClick }) => {
    console.log(rec);
    return (rec &&
        <div className="record-popup" onClick={handleClick}>
            <img className="cover" src={rec.cover} />
            <div className="left">
                <div className="artists"><Artists artists={rec.artists} handleClick={handleArtistClick} /></div>
                <div className="name">{rec.name}</div>
                <div className="format">{rec.format}</div>
                <div className="year">{rec.year}</div>
                <div className="tracks">
                    {rec.tracks && rec.tracks.map((track, index) => (
                        <div className="track" key={index}>
                            <span className="position">{track.position}</span> {track.name}
		                    { track.artists && (
                                <Fragment>
                                    {" ("}<Artists artists={track.artists} handleClick={handleArtistClick} />{")"}
                                </Fragment>)
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default RecordPopup;
