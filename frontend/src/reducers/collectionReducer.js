import {
    SELECT_RECORD,
    HIDE_RECORD,
    SELECT_LISTEN,
    SET_USERNAME,
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    COLLECTION_ERROR,
    REQUEST_RECORD,
    RECEIVE_RECORD,
    RECORD_ERROR
} from "../actions";

function collection(state = {
    discogsUsername: "",
    collection: {}, 
    activeRecord: null,
    activeListen: null
}, action) {
    switch(action.type) {
        case SELECT_RECORD:
            return Object.assign({}, state, { activeRecord: action.record.id });
        case HIDE_RECORD:
            return Object.assign({}, state, { activeRecord: null });
        case SELECT_LISTEN:
            return Object.assign({}, state, { activeListen: action.listen });
        case REQUEST_COLLECTION:
            return state;
        case RECEIVE_COLLECTION:
            return Object.assign({}, state, { collection: action.collection });
        case COLLECTION_ERROR:
            return state;
        case REQUEST_RECORD:
            return state;
        case RECEIVE_RECORD:
            return Object.assign({}, state, {
				collection: {...state.collection, [action.record.id]: action.record }
			});
        case RECORD_ERROR:
            return state;
        case SET_USERNAME:
            return Object.assign({}, state, { discogsUsername: action.user });
        default:
            return state;
    }
}

export default collection;
