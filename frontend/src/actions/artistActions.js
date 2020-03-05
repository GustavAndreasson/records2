import api from '../api';

export const SHOW_ARTIST = "SHOW_ARTIST";
export const showArtist = artist => ({
    type: SHOW_ARTIST,
    artist
})

export const HIDE_ARTIST = "HIDE_ARTIST";
export const hideArtist = () => ({
    type: HIDE_ARTIST
})

export const REQUEST_ARTIST = "REQUEST_ARTIST";
export const requestArtist = () => ({
    type: REQUEST_ARTIST
})

export const RECEIVE_ARTIST = "RECEIVE_ARTIST";
export const receiveArtist = json => ({
    type: RECEIVE_ARTIST,
    artist: json
})

export const getArtist = () => (dispatch, getState) => {
    dispatch(requestArtist());
    api.getArtist(getState().activeArtist.id)
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}

export const updateArtist = () => (dispatch, getState) => {
    dispatch(requestArtist());
    api.updateArtist(getState().activeArtist.id)
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}