import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Record from "./Record";
import RecordPopup from "./RecordPopup";
import ArtistInfo from "./ArtistInfo";
import UsernameInput from "./UsernameInput";
import FiltersPopup from "./FiltersPopup";
import OrdersPopup from "./OrdersPopup";

class App extends Component {
    state = {
        discogsUsername: "",
        collection: {},
        loaded: false,
        placeholder: "Loading...",
        activeRecord: null,
        activeArtist: null,
        searchQuery: "",
        filters: [],
        orders: [],
        showFilters: false,
        showOrders: false
    };
    componentDidMount() {
        let user = localStorage.getItem('discogs_username');
        if (user) {
            this.setUsername(user);
        }
    }
    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }
    getCollection = (username) => {
        fetch("records/collection/" + username + "/get/2")
        .then(this.handleErrors)
        .then(data => this.setState({ collection: data, loaded: true }))
        .catch(error => {
            console.log(error);
            this.setState({ placeholder: "Something whent wrong" });
        });
    }
    updateCollection = () => {
        fetch("records/collection/" + this.state.discogsUsername + "/update")
        .then(this.handleErrors)
        .then(data => this.setState({ collection: data, loaded: true }))
        .catch(error => {
            console.log(error);
            this.setState({ placeholder: "Something whent wrong" });
        });
    }
    setUsername = (username) => {
        if (username) {
            localStorage.setItem('discogs_username', username);
            this.setState({ discogsUsername: username });
            this.getCollection(username);
        }
    }
    search = (event) => this.setState({ searchQuery: event.target.value })
    filterRecord = (rec) => (
        (
            !this.state.activeArtist ||
            rec.artists.map(artist => artist.artist.id).includes(this.state.activeArtist.id) ||
            (rec.tracks &&
                rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(this.state.activeArtist.id))) ||
            (this.state.activeArtist.members &&
                this.state.activeArtist.members.some(member =>
                    rec.artists.map(artist => artist.artist.id).includes(member.artist.id) ||
                    (rec.tracks &&
                        rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(member.artist.id))))) ||
            (this.state.activeArtist.groups &&
                this.state.activeArtist.groups.some(group =>
                    rec.artists.map(artist => artist.artist.id).includes(group.artist.id) ||
                    (rec.tracks &&
                        rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(group.artist.id)))))
        ) &&
        (
            this.state.searchQuery == "" ||
            rec.name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) >= 0 ||
            rec.artists.map(artist => artist.artist.name).join().toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) >= 0
        ) &&
        (
            !this.state.filters ||
            this.state.filters.every(filter => filter.run(rec))
        )
    )
    handleRecordClick = (rec) => this.setState({activeRecord: rec});
    handleRecordPopupClick = () => this.setState({activeRecord: null});
    handleArtistClick = (artist) => {
        this.setState({activeArtist: artist});
        fetch("records/artist/" + artist.id + "/get")
        .then(this.handleErrors)
        .then(data => {
            this.setState({activeArtist: data});
            console.log(data);
            !data.updated &&
                fetch("records/artist/" + artist.id + "/update")
                .then(response => response.json())
                .then(data => {
                    this.setState({activeArtist: data});
                    console.log(data);
                });
        })
        .catch(error => console.log(error));
    }
    handleArtistCloseClick = () => this.setState({activeArtist: null});
    render() {
        const {
            discogsUsername,
            collection,
            loaded,
            placeholder,
            activeRecord,
            activeArtist,
            searchQuery,
            filters,
            orders,
            showFilters,
            showOrders
        } = this.state;
        let orderedFilteredCollection = orders.reduce((col, order) => order.run(col), Object.values(collection)).reduce((col, rec) =>
            this.filterRecord(rec) ? col.concat(rec.id) : col,
            []
        );
        let prices = orderedFilteredCollection.reduce((prcs, recId) =>
            collection[recId].price ? prcs.concat(collection[recId].price) : prcs,
            []
        );
        let priceSum = prices.reduce((sum, price) => sum + parseFloat(price),  0);
        return (
            <Fragment>
                <div className="header">
                    <h1>Skivorna</h1>
                    { discogsUsername &&
                        <Fragment>
                            <div className="search">
                                <input type="text" value={searchQuery} onChange={this.search} />
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={() => this.setState({ showFilters: true })}>&#9660;</button>
                                <button type="button" onClick={() => this.setState({ showOrders: true })}>&#8645;</button>
                                <button type="button" onClick={this.updateCollection}>&#8635;</button>
                            </div>
                            { loaded &&
                                <div className="stats">
                                    <div className="counter">{"Antal skivor: " + orderedFilteredCollection.length}</div>
                                    <div className="price-sum">{"Pris summa: " + priceSum}</div>
                                    <div className="price-avg">{"Pris medel: " + (priceSum / prices.length)}</div>
                                </div>
                            }
                            { showFilters &&
                                <FiltersPopup
                                    filters={filters}
                                    handleUpdate={(f) => this.setState({ filters: f })}
                                    handleClose={() => this.setState({ showFilters: false })}
                                />
                            }
                            { showOrders &&
                                <OrdersPopup
                                    orders={orders}
                                    handleUpdate={(o) => this.setState({ orders: o })}
                                    handleClose={() => this.setState({ showOrders: false })}
                                />
                            }
                        </Fragment>
                    }
                </div>
                { discogsUsername ?
                    <Fragment>
                        { activeArtist &&
                            <ArtistInfo
                                artist={activeArtist}
                                handleArtistClick={this.handleArtistClick}
                                handleCloseClick={this.handleArtistCloseClick}
                            />
                        }
                        { loaded ?
                            <div className="collection">
                                { orderedFilteredCollection &&
                                    orderedFilteredCollection.map(recId =>
                                        <Record rec={collection[recId]} handleClick={this.handleRecordClick} key={recId} />, this)
                                }
                            </div>
                            : placeholder
                        }
                        { activeRecord &&
                            <RecordPopup
                                rec={activeRecord}
                                handleClick={this.handleRecordPopupClick}
                                handleArtistClick={this.handleArtistClick}
                            />
                        }
                    </Fragment>
                :
                    <UsernameInput handleClick={this.setUsername} />
                }
            </Fragment>
        )
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
