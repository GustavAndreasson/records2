import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Record from "./Record";
import RecordPopup from "./RecordPopup";
import ArtistInfo from "./ArtistInfo";

class App extends Component {
    state = {
        collection: {},
        loaded: false,
        placeholder: "Loading...",
        activeRecord: null,
        activeArtist: null,
        searchQuery: ""
    };
    componentDidMount() {
        fetch("records/collection/gustav.andreasson/get/2")
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
        })
        .then(data => this.setState({ collection: data, loaded: true }));
    }
    search = (event) => this.setState({ searchQuery: event.target.value })
    filter = (rec) => (
        (
            !this.state.activeArtist ||
            rec.artists.map(artist => artist.artist.id).includes(this.state.activeArtist.id)
        ) &&
        (
            this.state.searchQuery == "" ||
            rec.name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) >= 0 ||
            rec.artists.map(artist => artist.artist.name).join().toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) >= 0
        )
    )
    handleRecordClick = (rec) => this.setState({activeRecord: rec});
    handleRecordPopupClick = () => this.setState({activeRecord: null});
    handleArtistClick = (artist) => this.setState({activeArtist: artist});
    handleArtistCloseClick = () => this.setState({activeArtist: null});
    render() {
        const { collection, loaded, placeholder, activeRecord, activeArtist, searchQuery } = this.state;
        return (
            <Fragment>
                <div className="header">
                    <h1>Skivorna</h1>
                    <div className="search">
                        <input type="text" value={searchQuery} onChange={this.search} />
                    </div>
                </div>
                { activeArtist &&
                    <ArtistInfo artist={activeArtist} handleArtistClick={this.handleArtistClick} handleCloseClick={this.handleArtistCloseClick} />
                }
                { loaded ?
        		    <div className="collection">
        		        { collection &&
                            Object.values(collection).map((rec) => this.filter(rec) && <Record rec={rec} handleClick={this.handleRecordClick} key={rec.id} />, this)
                        }
        		    </div>
		                  : placeholder }
                { activeRecord &&
                    <RecordPopup rec={activeRecord} handleClick={this.handleRecordPopupClick} handleArtistClick={this.handleArtistClick} />
                }
            </Fragment>
        )
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
