import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideArtist, hideRecord, showOrders, showFilters } from "../actions";
import { getCollection } from "../api";
import Header from "./Header";
import Collection from "./Collection";
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

const mapStateToProps = state => ({
    status: state.status,
    showFilters: state.showFilters,
    showOrders:  state.showOrders,
    activeRecord: state.activeRecord,
    activeArtist: state.activeArtist,
    discogsUsername: state.discogsUsername
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getCollection: getCollection,
    hideRecord: hideRecord,
    hideOrders: () => showOrders(false),
    hideFilters: () => showFilters(false)
}, dispatch);

class App extends Component {
    componentDidMount() {
        if (this.props.discogsUsername) {
            const { getCollection } = this.props;
            getCollection();
        }
    }
/*    state = {
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
    setSearch = (event) => this.setState({ searchQuery: event.target.value })
    setYear = (year) => this.setFilters(this.state.filters.concat({
        attribute: "year",
        compare: "eq",
        value: year,
        run: FilterUtil.getFunction("year", "eq", year)
    }))
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
        this.setState({ activeArtist: artist, activeRecord: null });
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
    handleArtistCloseClick = () => this.setState({ activeArtist: null });*/
    render() {
        const {
            status,
            showFilters,
            showOrders,
            activeRecord,
            hideRecord,
            discogsUsername,
            hideOrders,
            hideFilters
        } = this.props;
        /*let orderedFilteredCollection = orders.reduceRight((col, order) => order.run(col), Object.values(collection)).reduce((col, rec) =>
            this.filterRecord(rec) ? col.concat(rec.id) : col,
            []
        );
        let prices = orderedFilteredCollection.reduce((prcs, recId) =>
            collection[recId].price ? prcs.concat(collection[recId].price) : prcs,
            []
        );
        let priceSum = prices.reduce((sum, price) => sum + parseFloat(price),  0);*/
        return (
            <Fragment>
                <Header />
                <Filters />
                <Orders />
                { status &&
                    <div className="status">{status}</div>
                }
                { discogsUsername ?
                    <Fragment>
                        <ArtistInfo />
                        <Collection />
                        <RecordInfo />
                    </Fragment>
                :
                    <UsernameInput />
                }
            </Fragment>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
