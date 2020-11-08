import React, { Fragment,  useEffect } from "react";
import Popup from "Components/Popup";
import Artists from "./Artists";
import Listen from "./Listen";
import "./RecordInfo.scss";

const RecordInfo = ({ rec, updateRecord, handleYearClick, handleListenClick }) => {
    useEffect(() => {
        if (rec) {
            let threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            if (!rec.updated || rec.updated < threeMonthsAgo.toISOString()) {
                updateRecord(rec);
            }
        }
    }, [rec]);

    return (rec &&
        <Fragment>
            <Popup name="recordInfo" icon={{icon: "fas fa-record-vinyl"}} title={rec.name} scrolling={true}>
                <div className="record-info">
                    <img className="cover" src={rec.cover} />
                    <div className="artists"><Artists artists={rec.artists} /></div>
                    <div className="left">
                        { rec.format && <div className="format">{rec.format}</div> }
                        { rec.year && <div className="year" onClick={() => handleYearClick(rec.year)}>{rec.year}</div> }
                        { rec.price && <div className="price">{"(" + rec.price + ")"}</div> }
                        <div className="tracks">
                            {rec.tracks && rec.tracks.map((track, index) => (
                                <div className="track" key={index}>
                                    <span className="position">{track.position}</span> {track.name}
                                    { track.artists && (
                                        <Fragment>
                                            {" ("}<Artists artists={track.artists} />{")"}
                                        </Fragment>)
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right">
                        {rec.listens && rec.listens.map((listen, index) => (
                            <div className="listen-link" key={index}>
                                <button type="button">
                                    <img src={listen.icon} onClick={() => handleListenClick(listen)}/>
                                </button>
                                { listen.name || listen.type }
                            </div>
                        ))}
                    </div>
                </div>
            </Popup>
            <Listen />
        </Fragment>
    )
}

export default RecordInfo;
