import FilterUtil from "../util/Filter";
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
    FILTER_YEAR
 } from "../constants/action-types";

const initialState = {
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

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case SHOW_RECORD:
            return Object.assign({}, state, { activeRecord: action.record });
        case HIDE_RECORD:
            return Object.assign({}, state, { activeRecord: null });
        case SHOW_ARTIST:
            return Object.assign({}, state, { activeArtist: action.record });
        case HIDE_ARTIST:
            return Object.assign({}, state, { activeArtist: null });
        case SET_ORDERS:
            return Object.assign({}, state, { orders: action.orders });
        case SET_FILTERS:
            return Object.assign({}, state, { filters: action.filters });
        case UPDATE_SEARCH:
            return Object.assign({}, state, { searchQuery: action.query });
        case SHOW_FILTERS:
            return Object.assign({}, state, { showFilters: state.show });
        case SHOW_ORDERS:
            return Object.assign({}, state, { showOrders: state.show });
        case UPDATE_COLLECTION:
            return state;
        case SET_USERNAME:
            return Object.assign({}, state, { discogsUsername: action.user });
        case FILTER_YEAR:
            return Object.assign({}, state, { filters: [ ...state.filters, {
                attribute: "year",
                compare: "eq",
                value: action.year,
                run: FilterUtil.getFunction("year", "eq", action.year)
            }] });
        default:
            return state;
    }
}

export default rootReducer;
