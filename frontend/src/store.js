import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "Reducers";
import Filter from "Utils/Filter";
import Order from "Utils/Order";
import Persistant from "Utils/Persistant";

Persistant.init([
    { path: "process.filters", lsKey: "filters", qKey : "f", validate: Filter.validate, default: [] },
    { path: "process.orders", lsKey: "orders", qKey: "o", validate: Order.validate, default: [] },
    { path: "collection.discogsUsername", lsKey: "discogs_username", qKey: "u", default: "" },
    { path: "artist.activeArtist", lsKey: "active_artist",  qKey: "a", ref: true, default: null },
    { path: "artist.viewArtistCollection", lsKey: "view_artist_collection", qKey: "va", default: false }
]);

const initialState = {
    collection: {
        discogsUsername: "",
        collection: {},
        activeRecord: null,
        activeListen: null
    },
    artist: {
        activeArtist: null,
        artistCollection: {},
        viewArtistCollection: false
    },
    process: {
        searchQuery: "",
        filters: [],
        orders: []
    },
    ui: {
        collectionLoading: false,
        progress: null,
        status: "",
        popups: ""
    }
};

Persistant.update(initialState);

history.replaceState({}, document.title, location.protocol + "//" + location.host);

const middlewares = [thunk];

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

Persistant.subscribe(store);

export default store;
