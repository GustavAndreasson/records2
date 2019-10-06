import React, { Component, Fragment } from "react";

class ArtistInfo extends Component {
    state = {
        artist: {},
        loaded: false,
        placeholder: "Loading..."
    };
    fetchData(uri, callback) {
        fetch(uri)
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "Something went wrong", loaded: false });
            }
            return response.json();
        })
        .then(callback);
    }
    componentDidMount() {
        this.fetchData("records/artist/" + this.props.artist.id + "/get", data => {
            this.setState({ artist: data, loaded: true })
            !data.updated &&
                this.fetchData(
                    "records/artist/" + this.props.artist.id + "/update",
                    data => this.setState({ artist: data })
                );
        });
    }
    render() {
        const { artist, loaded, placeholder } = this.state;
        return (
            <div className="ArtistInfo" onClick={this.props.handleCloseClick}>
                <div className="name">{this.props.artist.name}</div>
                { this.state.loaded ?
                    <Fragment>
                        { artist.image && <img src={artist.image} /> }
                        { artist.description && <div className="description">
                            {artist.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                        </div> }
                        { artist.members && <div className="members">
                            { artist.members.map((member, index) => (
                                <Fragment key={member.artist.id}>
                                    { index > 0 && ", " }
                                    <span className={"artist " + (member.active ? "active" : "inactive")}
                                        onClick={() => this.props.handleArtistClick(member.artist)}>
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
                                        onClick={() => this.props.handleArtistClick(group.artist)}>
                                        {group.artist.name}
                                    </span>
                                </Fragment>
                            ))}
                        </div> }
                    </Fragment>
                    : this.state.placeholder
                }
            </div>
        );
    }
}
export default ArtistInfo;
