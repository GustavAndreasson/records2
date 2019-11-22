import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { filterYear } from '../actions';
import "./styling/RecordInfo.scss";
import Artists from "./Artists";

const mapStateToProps = state => ({
    rec: state.activeRecord
});

const mapDispatchToProps = dispatch => ({
    handleYearClick: year => { dispatch(filterYear(year)) }
});

const ConnectedRecordInfo = ({ rec, handleYearClick }) => (rec &&
    <div className="record-info" onClick={handleClick}>
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
)

const RecordInfo = connect(mapStateToProps, mapDispatchToProps)(ConnectedRecordInfo);
export default RecordInfo;
