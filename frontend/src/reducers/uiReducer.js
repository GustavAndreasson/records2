import {
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    COLLECTION_ERROR,
    REQUEST_ARTIST_COLLECTION,
    RECEIVE_ARTIST_COLLECTION,
    ARTIST_COLLECTION_ERROR,
    UPDATE_PROGRESS,
    SHOW_POPUP,
    HIDE_POPUP,
    SHOW_RECORD,
    SHOW_LISTEN
} from "Actions";

function ui(state = { collectionLoading: false, progress: {}, status: "", popups: "" }, action) {
    switch(action.type) {
        case REQUEST_COLLECTION:
        case REQUEST_ARTIST_COLLECTION:
            return Object.assign({}, state, {
                collectionLoading: true,
                progress: {},
                status: "Hämtar skivor..."
            });
        case RECEIVE_COLLECTION:
        case RECEIVE_ARTIST_COLLECTION:
            return Object.assign({}, state, {
                collectionLoading: false,
				status: false
			});
        case COLLECTION_ERROR:
        case ARTIST_COLLECTION_ERROR:
            return Object.assign({}, state, {
                collectionLoading: false,
                status: "Något gick fel..."
            });
        case UPDATE_PROGRESS:
            return Object.assign({}, state, { progress: action.progress });
        case SHOW_POPUP:
            return Object.assign({}, state, { popups: action.popup });
        case HIDE_POPUP:
            return Object.assign({}, state, {
                popups: state.popups.indexOf(action.popup) === 0
                    ? action.popup.substr(0, action.popup.lastIndexOf("."))
                    : state.popups
            });
        case SHOW_RECORD:
            return Object.assign({}, state, { popups: "recordInfo" });
        case SHOW_LISTEN:
            return Object.assign({}, state, { popups: "recordInfo.listen" });
        default:
            return state;
    }
}

export default ui;
