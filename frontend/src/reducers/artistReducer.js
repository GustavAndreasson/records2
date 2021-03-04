import {
    SHOW_ARTIST,
    HIDE_ARTIST,
    REQUEST_ARTIST,
    RECEIVE_ARTIST,
    REQUEST_ARTIST_COLLECTION,
    RECEIVE_ARTIST_COLLECTION,
    ARTIST_ERROR,
    VIEW_ARTIST_COLLECTION,
    TOGGLE_VIEW_ARTIST_COLLECTION,
    RECEIVE_RECORD,
    FILTER_YEAR
} from "Actions";

function artist(state={
    activeArtist: null,
    artistCollection: null,
    viewArtistCollection: false
}, action) {
    switch(action.type) {
        case SHOW_ARTIST:
            return Object.assign({}, state, {
                activeArtist: action.artist,
                artistCollection: null
            });
        case HIDE_ARTIST:
            return Object.assign({}, state, {
                activeArtist: null,
                viewArtistCollection: false
            });
        case REQUEST_ARTIST:
            return state;
        case RECEIVE_ARTIST:
            return Object.assign({}, state, {
                activeArtist: state.activeArtist.id === action.artist.id
                    ? action.artist
                    : state.activeArtist
            });
        case REQUEST_ARTIST_COLLECTION:
            return state;
        case RECEIVE_ARTIST_COLLECTION:
            return Object.assign({}, state, {
                artistCollection: {...state.artistCollection, ...action.collection}
            });
        case ARTIST_ERROR:
            return state;
        case RECEIVE_RECORD:
            return Object.assign({}, state, state.artistCollection && {
				artistCollection: action.record.id in state.artistCollection
                    ? {...state.artistCollection, [action.record.id]: action.record }
                    : state.artistCollection
			});
        case VIEW_ARTIST_COLLECTION:
            return Object.assign({}, state, {
                viewArtistCollection: action.view
            });
        case TOGGLE_VIEW_ARTIST_COLLECTION:
            return Object.assign({}, state, {
                viewArtistCollection: !state.viewArtistCollection
            });
        case FILTER_YEAR:
            return Object.assign({}, state, {
                activeRecord: null
            });
        default:
            return state;
    }
}

export default artist;
