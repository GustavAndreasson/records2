import {
    SHOW_RECORD,
    HIDE_RECORD,
    SHOW_LISTEN,
    SET_USERNAME,
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    COLLECTION_ERROR,
    REQUEST_RECORD,
    RECEIVE_RECORD,
    RECORD_ERROR,
    SHOW_ARTIST
} from "Actions";

function collection(state = {
    discogsUsername: "",
    collection: null,
    activeRecord: null,
    activeListen: null
}, action) {
    switch(action.type) {
        case SHOW_RECORD:
            return Object.assign({}, state, {
                activeRecord: action.record.id
            });
        case SHOW_ARTIST:
        case HIDE_RECORD:
            return Object.assign({}, state, {
                activeRecord: null
            });
        case SHOW_LISTEN:
            return Object.assign({}, state, {
                activeListen: action.listen
            });
        case REQUEST_COLLECTION:
            return state;
        case RECEIVE_COLLECTION:
            return Object.assign({}, state, {
                collection: {...state.collection, ...action.collection}
            });
        case COLLECTION_ERROR:
            return state;
        case REQUEST_RECORD:
            return state;
        case RECEIVE_RECORD:
            return Object.assign({}, state, state.collection && {
				collection: action.record.id in state.collection
                    ? {...state.collection, [action.record.id]: {
                        ...action.record,
                        addedDate: state.collection[action.record.id].addedDate
                    } }
                    : state.collection
			});
        case RECORD_ERROR:
            return state;
        case SET_USERNAME:
            return Object.assign({}, state, {
                discogsUsername: action.user,
                collection: null
            });
        default:
            return state;
    }
}

export default collection;
