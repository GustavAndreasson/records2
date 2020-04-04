import api from "../api";
import { hideRecord } from "./recordActions";

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

export const ARTIST_ERROR = "ARTIST_ERROR";
export const artistError = () => ({
    type: ARTIST_ERROR
})

export const showArtist = (artist) => async (dispatch, getState) => {
    dispatch(hideRecord());
    dispatch(selectArtist(artist));
    dispatch(requestArtist());
    try {
        let response = await api.getArtist(artist.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveArtist(json))
        let threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        if (!json.updated || json.updated < threeMonthsAgo.toISOString()) {
            dispatch(updateArtist(artist));
        }
    } catch (error) {
        dispatch(artistError());
        console.log(error);
    }
}

export const getArtist = (artist) => async (dispatch, getState) => {
    try {
        dispatch(requestArtist());
        let response = await api.getArtist(artist.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveArtist(json));
    } catch (error) {
        dispatch(artistError());
        console.log(error);
    }
}

export const updateArtist = (artist) => async (dispatch, getState) => {
    dispatch(requestArtist());
    try {
        let response = await api.updateArtist(artist.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveArtist(json));
    } catch (error) {
        dispatch(artistError());
        console.log(error);
    }
}
