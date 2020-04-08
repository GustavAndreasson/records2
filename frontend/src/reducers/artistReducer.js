import {
    SELECT_ARTIST,
    HIDE_ARTIST,
    REQUEST_ARTIST,
    RECEIVE_ARTIST,
    ARTIST_ERROR,
    FILTER_YEAR
} from "../actions";

function artist(state={ activeArtist: null }, action) {
    switch(action.type) {
        case SELECT_ARTIST:
            return Object.assign({}, state, { activeArtist: action.artist });
        case HIDE_ARTIST:
            return Object.assign({}, state, { activeArtist: null });
        case REQUEST_ARTIST:
            return state;
        case RECEIVE_ARTIST:
            return Object.assign({}, state, {
                activeArtist: state.activeArtist.id === action.artist.id
                    ? action.artist
                    : state.activeArtist
            });
        case ARTIST_ERROR:
            return state;
        case FILTER_YEAR:
            return Object.assign({}, state, { activeRecord: null });
        default:
            return state;
    }
}

export default artist;
