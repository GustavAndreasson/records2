import React, { Fragment } from "react";
import "./styling/RecordInfo.scss";

import Artists from "./Artists";

const RecordInfo = ({ rec, handleClick,  handleArtistClick, handleYearClick }) => {
    console.log(rec);
    return (rec &&
        <div className="record-info" onClick={handleClick}>
            <img className="cover" src={rec.cover} />
            <div className="left">
                <div className="artists"><Artists artists={rec.artists} handleClick={handleArtistClick} /></div>
                <div className="name">{rec.name}</div>
                <div className="format">{rec.format}</div>
                <div className="year" onClick={() => handleYearClick(rec.year)}>{rec.year}</div>
                { rec.price && <div className="price">{"(" + rec.price + ")"}</div> }
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
export default RecordInfo;
