import React, { Fragment } from "react";
import { connect } from "react-redux";
import { hideArtist } from "../actions";
import Artist from "./Artist.js";
import "./styling/ArtistInfo.scss";

const mapStateToProps = state => ({
    artist: state.activeArtist
});

const mapDispatchToProps = dispatch => ({
    handleCloseClick: () => { dispatch(hideArtist()) }
});

const ArtistInfo = ({ artist, handleCloseClick }) => (
    artist &&
    <div className="artist-info" onClick={handleCloseClick}>
        <div className="name">{artist.name}</div>
        { artist.image && <img src={artist.image} /> }
        { artist.description && <div className="description">
            {artist.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div> }
        { artist.members && <div className="members">
            { artist.members.map((member, index) => (
                <Fragment key={member.artist.id}>
                    { index > 0 && ", " }
                    <Artist artist={member.artist} active={member.active} />
                </Fragment>
            ))}
        </div> }
        { artist.groups && <div className="groups">
            { artist.groups.map((group, index) => (
                <Fragment key={group.artist.id}>
                    { index > 0 && ", " }
                    <Artist artist={group.artist} active={group.active} />
                </Fragment>
            ))}
        </div> }
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ArtistInfo);
