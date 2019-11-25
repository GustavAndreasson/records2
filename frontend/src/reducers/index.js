import FilterUtil from "../util/Filter";
import OrderUtil from "../util/Order";
import {
    SHOW_RECORD,
    HIDE_RECORD,
    SHOW_ARTIST,
    HIDE_ARTIST,
    SET_ORDERS,
    SET_FILTERS,
    UPDATE_SEARCH,
    SHOW_FILTERS,
    SHOW_ORDERS,
    UPDATE_COLLECTION,
    SET_USERNAME,
    FILTER_YEAR,
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION
} from "../actions";

function getOrderedFilteredCollection(state) {
    const { collection, orders, filters, activeArtist, searchQuery } = state;
    let filterRecord = (rec) => (
        (
            !activeArtist ||
            rec.artists.map(artist => artist.artist.id).includes(activeArtist.id) ||
            (rec.tracks &&
                rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(activeArtist.id))) ||
            (activeArtist.members &&
                activeArtist.members.some(member =>
                    rec.artists.map(artist => artist.artist.id).includes(member.artist.id) ||
                    (rec.tracks &&
                        rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(member.artist.id))))) ||
            (activeArtist.groups &&
                activeArtist.groups.some(group =>
                    rec.artists.map(artist => artist.artist.id).includes(group.artist.id) ||
                    (rec.tracks &&
                        rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(group.artist.id)))))
        ) &&
        (
            searchQuery == "" ||
            rec.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
            rec.artists.map(artist => artist.artist.name).join().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
        ) &&
        (
            !filters ||
            filters.every(filter => FilterUtil.run(filter)(rec))
        )
    );
    let orderedFilteredCollection = orders
        .reduceRight((col, order) => OrderUtil.run(order)(col), Object.values(collection))
        .reduce((col, rec) =>
            filterRecord(rec) ? col.concat(rec) : col,
            []
        );
    /*let prices = orderedFilteredCollection.reduce((prcs, recId) =>
        collection[recId].price ? prcs.concat(collection[recId].price) : prcs,
        []
    );
    let priceSum = prices.reduce((sum, price) => sum + parseFloat(price),  0);*/
    return orderedFilteredCollection;
}

function rootReducer(state, action) {
    let newState = state;
    switch(action.type) {
        case SHOW_RECORD:
            return Object.assign({}, state, { activeRecord: action.record });
        case HIDE_RECORD:
            return Object.assign({}, state, { activeRecord: null });
        case SHOW_ARTIST:
            newState = Object.assign({}, state, { activeArtist: action.record });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        case HIDE_ARTIST:
            return Object.assign({}, state, { activeArtist: null });
        case SET_ORDERS:
            newState = Object.assign({}, state, { orders: action.orders });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        case SET_FILTERS:
            newState = Object.assign({}, state, { filters: action.filters });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        case UPDATE_SEARCH:
            newState = Object.assign({}, state, { searchQuery: action.query });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        case SHOW_FILTERS:
            return Object.assign({}, state, { showFilters: action.show });
        case SHOW_ORDERS:
            return Object.assign({}, state, { showOrders: action.show });
        case UPDATE_COLLECTION:
            return state;
        case REQUEST_COLLECTION:
            return state;
        case RECEIVE_COLLECTION:
            newState = Object.assign({}, state, { collection: action.collection, status: false });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        case SET_USERNAME:
            return Object.assign({}, state, { discogsUsername: action.user });
        case FILTER_YEAR:
            newState = Object.assign({}, state, {
                filters: [ ...state.filters, {
                    attribute: "year",
                    compare: "eq",
                    value: action.year
                }]
            });
            return Object.assign({}, newState, { orderedFilteredCollection: getOrderedFilteredCollection(newState) });
        default:
            return state;
    }
}

export default rootReducer;
