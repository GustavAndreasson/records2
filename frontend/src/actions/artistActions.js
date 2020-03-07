import api from '../api';
import { hideRecord } from './recordActions';

export const SELECT_ARTIST = "SELECT_ARTIST";
export const selectArtist = artist => ({
    type: SELECT_ARTIST,
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

export const showArtist = (artist) => (dispatch, getState) => {
    dispatch(selectArtist(artist));
    dispatch(hideRecord());
    dispatch(requestArtist());
    api.getArtist(getState().activeArtist.id)
        .then(response => response.json())
        .then(json => {
            dispatch(receiveArtist(json))
            let threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            if (!json.updated || json.updated < threeMonthsAgo.toISOString()) {
                dispatch(updateArtist(artist));
            }
        });
}

export const getArtist = (artist) => (dispatch, getState) => {
    dispatch(requestArtist());
    api.getArtist(artist.id)
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}

export const updateArtist = (artist) => (dispatch, getState) => {
    dispatch(requestArtist());
    api.updateArtist(artist.id)
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}
