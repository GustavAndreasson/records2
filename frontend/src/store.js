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
    discogsUsername: queryString["user"] || localStorage.getItem("discogs_username"),
    collection: {},
    collectionLoading: false,
    status: "Laddar samling...",
    activeRecord: null,
    activeArtist: /*activeArtistId ? {id: activeArtistId} :*/ null,
    activeListen: null,
    searchQuery: "",
    filters: filters,
    orders: orders,
    popups: ""
};

const middlewares = [thunk];

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

store.subscribe(() => {
    history.replaceState({}, document.title, location.protocol + "//" + location.host);
    localStorage.setItem("filters", JSON.stringify(store.getState().filters));
    localStorage.setItem("orders", JSON.stringify(store.getState().orders));
    /*localStorage.setItem("active_artist", store.getState().activeArtist ? store.getState().activeArtist.id : "");*/
    localStorage.setItem("discogs_username", store.getState().discogsUsername);
})

export default store;
