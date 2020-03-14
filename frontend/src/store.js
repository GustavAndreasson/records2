import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const initialState = {
    discogsUsername: localStorage.getItem("discogs_username"),
    collection: {},
    status: "Laddar samling...",
    activeRecord: null,
    activeArtist: null,
    activeListen: null,
    searchQuery: "",
    filters: JSON.parse(localStorage.getItem("filters")) || [],
    orders: JSON.parse(localStorage.getItem("orders")) || [],
    popups: ""
};

const middlewares = [thunk];

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

store.subscribe(() => {
    localStorage.setItem("filters", JSON.stringify(store.getState().filters));
    localStorage.setItem("orders", JSON.stringify(store.getState().orders));
    localStorage.setItem("discogs_username", store.getState().discogsUsername);
})

export default store;
