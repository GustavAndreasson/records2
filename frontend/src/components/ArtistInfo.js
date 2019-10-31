import React, { Fragment } from "react";
import Artist from "./Artist.js";
import "./styling/ArtistInfo.scss";

const ArtistInfo = ({ artist, handleArtistClick, handleCloseClick }) => (
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
                    <Artist artist={member.artist} handleClick={handleArtistClick} active={member.active} />
                </Fragment>
            ))}
        </div> }
        { artist.groups && <div className="groups">
            { artist.groups.map((group, index) => (
                <Fragment key={group.artist.id}>
                    { index > 0 && ", " }
                    <Artist artist={group.artist} handleClick={handleArtistClick} active={group.active} />
                </Fragment>
            ))}
        </div> }
    </div>
);
export default ArtistInfo;
