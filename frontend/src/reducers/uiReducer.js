import {
    REQUEST_COLLECTION,
    RECEIVE_COLLECTION,
    COLLECTION_ERROR,
    UPDATE_PROGRESS,
    SHOW_POPUP,
    HIDE_POPUP
} from "../actions";

function ui(state = { collectionLoading: false, progress: {}, status: "", popups: "" }, action) {
    switch(action.type) {
        case REQUEST_COLLECTION:
            return Object.assign({}, state, {
                collectionLoading: true,
                progress: {},
                status: "Hämtar skivor..."
            });
        case RECEIVE_COLLECTION:
            return Object.assign({}, state, {
                collectionLoading: false,
				status: false
			});
        case COLLECTION_ERROR:
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
        default:
            return state;
    }
}

export default ui;
