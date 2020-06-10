import React, { Fragment } from "react";
import Artist from "../Artist";
import "./ArtistInfo.scss";

const ArtistInfo = ({
    artist,
    viewArtistCollection,
    collectionLoading,
    handleCloseClick,
    handleShowCollectionClick
}) => (
    artist &&
    <div className="artist-info">
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
        <div className="artist-buttons">
            <button type="button"
                className="far fa-caret-square-left"
                onClick={handleCloseClick}>
            </button>
            <button type="button"
                className={"fas fa-list" + (viewArtistCollection ? " reversed" : "")}
                disabled={collectionLoading}
                onClick={handleShowCollectionClick}>
            </button>
        </div>
    </div>
);

export default ArtistInfo;
