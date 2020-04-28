import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import * as qs  from "query-string";
import Filter from "./util/Filter";
import Order from "./util/Order";

const queryString = qs.parse(location.search);
let filters = [];
try {
    filters = Filter.validate(JSON.parse(queryString["filters"] || localStorage.getItem("filters")) || []);
} catch (e) {
    console.log(e);
}
let orders = [];
try {
    orders = Order.validate(JSON.parse(queryString["orders"] || localStorage.getItem("orders")) || []);
} catch (e) {
    console.log(e);
}
/*const activeArtistId = queryString["artist"] || localStorage.getItem("active_artist");*/

const initialState = {
    collection: {
        discogsUsername: queryString["user"] || localStorage.getItem("discogs_username") || "",
        collection: {},
        activeRecord: null,
        activeListen: null
    },
    artist: {
        activeArtist: /*activeArtistId ? {id: activeArtistId} :*/ null,
        artistCollection: {},
        viewArtistCollection: false
    },
    process: {
        searchQuery: "",
        filters: filters,
        orders: orders
    },
    ui: {
        collectionLoading: false,
        progress: null,
        status: "",
        popups: ""
    }
};

history.replaceState({}, document.title, location.protocol + "//" + location.host);

const middlewares = [thunk];

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

store.subscribe(() => {
    localStorage.setItem("filters", JSON.stringify(store.getState().process.filters));
    localStorage.setItem("orders", JSON.stringify(store.getState().process.orders));
    /*localStorage.setItem("active_artist", store.getState().artist.activeArtist ? store.getState().artist.activeArtist.id : "");*/
    localStorage.setItem("discogs_username", store.getState().collection.discogsUsername);
})

export default store;
