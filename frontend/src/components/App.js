import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Header from "./Header";
import Record from "./Record";
import RecordInfo from "./RecordInfo";
import ArtistInfo from "./ArtistInfo";
import UsernameInput from "./UsernameInput";
import Popup from "./Popup";
import Filters from "./Filters";
import Orders from "./Orders";
import FilterUtil from "../util/Filter";
import OrderUtil from "../util/Order";
import "./styling/App.scss";

class App extends Component {
    state = {
        discogsUsername: "",
        collection: {},
        status: "Laddar samling...",
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
        let filters = localStorage.getItem('filters');
        if (filters) {
            this.setState({
                filters: JSON.parse(filters).map(f => { return { ...f, "run": FilterUtil.getFunction(f.attribute, f.compare, f.value) }; })
            });
        }
        let orders = localStorage.getItem('orders');
        if (orders) {
            this.setState({
                orders: JSON.parse(orders).map(o => { return { ...o, "run": OrderUtil.getFunction(o.attribute, o.reverse) }; })
            });
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
        .then(data => this.setState({ collection: data, status: false }))
        .catch(error => {
            console.log(error);
            this.setState({ status: "Something whent wrong" });
        });
    }
    updateCollection = () => {
        this.setState({ status: "Uppdaterar samling..." })
        fetch("records/collection/" + this.state.discogsUsername + "/update")
        .then(this.handleErrors)
        .then(data => this.setState({ collection: data, status: false }))
        .catch(error => {
            console.log(error);
            this.setState({ status: "Something whent wrong" });
        });
    }
    setUsername = (username) => {
        if (username) {
            localStorage.setItem('discogs_username', username);
            this.setState({ discogsUsername: username });
            this.getCollection(username);
        }
    }
    setFilters = (filters) => {
        localStorage.setItem('filters', JSON.stringify(filters));
        this.setState({ filters: filters });
    }
    setOrders = (orders) => {
        localStorage.setItem('orders', JSON.stringify(orders));
        this.setState({ orders: orders });
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
    handleRecordClick = (rec) => {
        this.setState({activeRecord: rec});
        let threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        if (!rec.updated || rec.updated < threeMonthsAgo.toISOString()) {
            fetch("records/record/" + rec.id + "/update")
            .then(this.handleErrors)
            .then(data => this.setState({ collection: {...this.state.collection, [rec.id]: data }, activeRecord: data }))
            .catch(error => console.log(error));
        }
    }
    handleCloseRecordInfo = () => this.setState({ activeRecord: null });
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
                .then(data => this.setState({ activeArtist: data }))
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }
    handleArtistCloseClick = () => this.setState({ activeArtist: null });
    render() {
        const {
            discogsUsername,
            collection,
            status,
            placeholder,
            activeRecord,
            activeArtist,
            searchQuery,
            filters,
            orders,
            showFilters,
            showOrders
        } = this.state;
        let orderedFilteredCollection = orders.reduceRight((col, order) => order.run(col), Object.values(collection)).reduce((col, rec) =>
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
                <Header
                    showControls={discogsUsername}
                    searchQuery={searchQuery}
                    handleSearchUpdated={this.search}
                    handleShowFilters={() => this.setState({ showFilters: true })}
                    handleShowOrders={() => this.setState({ showOrders: true })}
                    handleUpdateCollection={this.updateCollection}
                    collectionStats={
                        orderedFilteredCollection.length > 0 && {
                            qty: orderedFilteredCollection.length,
                            sum: priceSum.toFixed(2),
                            avg: (priceSum / prices.length).toFixed(2)
                        }
                    }
                />
                { showFilters &&
                    <Popup handleClose={() => this.setState({ showFilters: false })}>
                        <Filters
                            filters={filters}
                            handleUpdate={this.setFilters}
                        />
                    </Popup>
                }
                { showOrders &&
                    <Popup handleClose={() => this.setState({ showOrders: false })}>
                        <Orders
                            orders={orders}
                            handleUpdate={this.setOrders}
                        />
                    </Popup>
                }
                { status &&
                    <div className="status">{status}</div>
                }
                { discogsUsername ?
                    <Fragment>
                        { activeArtist &&
                            <ArtistInfo
                                artist={activeArtist}
                                handleArtistClick={this.handleArtistClick}
                                handleCloseClick={this.handleArtistCloseClick}
                            />
                        }
                        { orderedFilteredCollection.length > 0  &&
                            <div className="collection">
                                { orderedFilteredCollection &&
                                    orderedFilteredCollection.map(recId =>
                                        <Record rec={collection[recId]} handleClick={this.handleRecordClick} key={recId} />, this)
                                }
                            </div>
                        }
                        { activeRecord &&
                            <Popup handleClose={this.handleCloseRecordInfo}>
                                <RecordInfo
                                    rec={activeRecord}
                                    handleArtistClick={this.handleArtistClick}
                                />
                            </Popup>
                        }
                    </Fragment>
                :
                    <UsernameInput handleSetUsername={this.setUsername} />
                }
            </Fragment>
        )
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
