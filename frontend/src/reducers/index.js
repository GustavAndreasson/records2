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
    SET_USERNAME,
    FILTER_YEAR,
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    REQUEST_RECORD,
    RECEIVE_RECORD,
    REQUEST_ARTIST,
    RECEIVE_ARTIST
} from "../actions";

function rootReducer(state, action) {
    let newState = state;
    switch(action.type) {
        case SHOW_RECORD:
            return Object.assign({}, state, { activeRecord: action.record.id });
        case HIDE_RECORD:
            return Object.assign({}, state, { activeRecord: null });
        case SHOW_ARTIST:
            return Object.assign({}, state, { activeArtist: action.artist });
        case HIDE_ARTIST:
            return Object.assign({}, state, { activeArtist: null });
        case SET_ORDERS:
            return Object.assign({}, state, { orders: action.orders });
        case SET_FILTERS:
            return Object.assign({}, state, { filters: action.filters });
        case UPDATE_SEARCH:
            return Object.assign({}, state, { searchQuery: action.query });
        case SHOW_FILTERS:
            return Object.assign({}, state, { showFilters: action.show });
        case SHOW_ORDERS:
            return Object.assign({}, state, { showOrders: action.show });
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
            return Object.assign({}, state, { activeArtist: action.artist });
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
        default:
            return state;
    }
}

export default rootReducer;
