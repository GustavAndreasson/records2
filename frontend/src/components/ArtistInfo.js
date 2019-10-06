import React, { Fragment } from "react";

const ArtistInfo = ({ artist, handleArtistClick, handleCloseClick }) => (
    <div className="ArtistInfo" onClick={handleCloseClick}>
        <div className="name">{artist.name}</div>
        { artist.image && <img src={artist.image} /> }
        { artist.description && <div className="description">
            {artist.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        </div> }
        { artist.members && <div className="members">
            { artist.members.map((member, index) => (
                <Fragment key={member.artist.id}>
                    { index > 0 && ", " }
                    <span className={"artist " + (member.active ? "active" : "inactive")}
                        onClick={() => handleArtistClick(member.artist)}>
                        {member.artist.name}
                    </span>
                </Fragment>
            ))}
        </div> }
        { artist.groups && <div className="groups">
            { artist.groups.map((group, index) => (
                <Fragment key={group.artist.id}>
                    { index > 0 && ", " }
                    <span className={"artist " + (group.active ? "active" : "inactive")}
                        onClick={() => handleArtistClick(group.artist)}>
                        {group.artist.name}
                    </span>
                </Fragment>
            ))}
        </div> }
    </div>
);
export default ArtistInfo;
