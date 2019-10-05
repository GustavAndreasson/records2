import React, { Component, Fragment } from "react";

class ArtistInfo extends Component {
    render() {
        return (
            <div className="ArtistInfo" onClick={this.props.handleCloseClick}>
                {this.props.artist.name}
            </div>
        );
    }
}
export default ArtistInfo;
