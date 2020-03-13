import {
    SELECT_RECORD,
    HIDE_RECORD,
    SELECT_ARTIST,
    HIDE_ARTIST,
    SET_ORDERS,
    SET_FILTERS,
    UPDATE_SEARCH,
    SET_USERNAME,
    FILTER_YEAR,
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    REQUEST_RECORD,
    RECEIVE_RECORD,
    REQUEST_ARTIST,
    RECEIVE_ARTIST,
    SHOW_POPUP,
    HIDE_POPUP
} from "../actions";

function rootReducer(state, action) {
    switch(action.type) {
        case SELECT_RECORD:
            return Object.assign({}, state, { activeRecord: action.record.id });
        case HIDE_RECORD:
            return Object.assign({}, state, { activeRecord: null });
        case SELECT_ARTIST:
            return Object.assign({}, state, { activeArtist: action.artist });
        case HIDE_ARTIST:
            return Object.assign({}, state, { activeArtist: null });
        case SET_ORDERS:
            return Object.assign({}, state, { orders: action.orders });
        case SET_FILTERS:
            return Object.assign({}, state, { filters: action.filters });
        case UPDATE_SEARCH:
            return Object.assign({}, state, { searchQuery: action.query });
        case REQUEST_COLLECTION:
            return Object.assign({}, state, { status: "Hämtar skivor..." });
        case RECEIVE_COLLECTION:
            return Object.assign({}, state, {
				collection: action.collection,
				status: false
			});
        case REQUEST_RECORD:
            return state;
        case RECEIVE_RECORD:
            return Object.assign({}, state, {
				collection: {...state.collection, [action.record.id]: action.record }
			});
        case REQUEST_ARTIST:
            return state;
        case RECEIVE_ARTIST:
            return Object.assign({}, state, {
                activeArtist: state.activeArtist.id === action.artist.id ? action.artist : state.activeArtist
            });
        case SET_USERNAME:
            return Object.assign({}, state, { discogsUsername: action.user });
        case FILTER_YEAR:
            return Object.assign({}, state, {
                filters: [ ...state.filters, {
                    attribute: "year",
                    compare: "eq",
                    value: action.year
                }]
            });
        case SHOW_POPUP:
            return Object.assign({}, state, { popups: action.popup });
        case HIDE_POPUP:
            return Object.assign({}, state, { 
                popups: state.popups === action.popup ? "" : state.popups
            });
        default:
            return state;
    }
}

export default rootReducer;
