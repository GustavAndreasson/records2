import api from "../api";
import { hideRecord } from "./recordActions";
import { progress } from "./uiActions";

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

export const REQUEST_ARTIST_COLLECTION = "REQUEST_ARTIST_COLLECTION";
export const requestArtistCollection = () => ({
    type: REQUEST_ARTIST_COLLECTION
})

export const RECEIVE_ARTIST_COLLECTION = "RECEIVE_ARTIST_COLLECTION";
export const receiveArtistCollection = json => ({
    type: RECEIVE_ARTIST_COLLECTION,
    collection: json
})

export const ARTIST_COLLECTION_ERROR = "ARTIST_COLLECTION_ERROR";
export const artistCollectionError = () => ({
    type: ARTIST_COLLECTION_ERROR
})

export const VIEW_ARTIST_COLLECTION = "VIEW_ARTIST_COLLECTION";
export const viewArtistCollection = view => ({
    type: VIEW_ARTIST_COLLECTION,
    view: view
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

export const getArtistCollection = (artist) => async (dispatch, getState) => {
    dispatch(requestArtistCollection());
    setTimeout(() => progress(dispatch), 100);
    let progressTimer = setInterval(() => progress(dispatch), 1000);
    try {
        let response = await api.getArtistReleases(artist.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveArtistCollection(json));
    } catch (error) {
        dispatch(artistCollectionError());
        console.log(error);
    } finally {
        clearInterval(progressTimer);
    }
}

export const updateArtistCollection = (artist) => async (dispatch, getState) => {
    dispatch(requestArtistCollection());
    setTimeout(() => progress(dispatch), 100);
    let progressTimer = setInterval(() => progress(dispatch), 1000);
    try {
        let response = await api.updateArtistReleases(artist.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveArtistCollection(json));
    } catch (error) {
        dispatch(artistCollectionError());
        console.log(error);
    } finally {
        clearInterval(progressTimer);
    }
}

export const toggleViewArtistCollection = () => (dispatch, getState) => {
    if (!getState().artist.viewArtistCollection) {
        dispatch(getArtistCollection(getState().artist.activeArtist));
    }
    dispatch(viewArtistCollection(!getState().artist.viewArtistCollection));
}
