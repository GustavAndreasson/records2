import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { hideRecord, filterYear } from '../actions';
import { selectActiveRecord } from "../selectors"
import "./styling/RecordInfo.scss";
import Popup from "./Popup";
import Artists from "./Artists";

const mapStateToProps = state => ({
    rec: selectActiveRecord(state)
});

const mapDispatchToProps = dispatch => ({
    hideRecord: () => { dispatch(hideRecord()) },
    handleYearClick: year => { dispatch(filterYear(year)) }
});

const RecordInfo = ({ rec, hideRecord, handleYearClick }) => (rec &&
    <Popup handleClose={hideRecord}>
        <div className="record-info">
            <img className="cover" src={rec.cover} />
            <div className="left">
                <div className="artists"><Artists artists={rec.artists} /></div>
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
                                    {" ("}<Artists artists={track.artists} />{")"}
                                </Fragment>)
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </Popup>
)

export default connect(mapStateToProps, mapDispatchToProps)(RecordInfo);
