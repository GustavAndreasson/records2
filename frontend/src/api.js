import {
    requestCollection, receiveCollection,
    requestArtist, receiveArtist,
} from "./actions";

export const getCollection = () => (dispatch, getState) => {
    dispatch(requestCollection());
    return fetch("records/collection/" + getState().discogsUsername + "/get/2")
        .then(response => response.json())
        .then(json => dispatch(receiveCollection(json)));
}

export const updateCollection = () => (dispatch, getState) => {
    dispatch(requestCollection());
    return fetch("records/collection/" + getState().discogsUsername + "/update")
        .then(response => response.json())
        .then(json => dispatch(receiveCollection(json)));
}

export const getArtist = () => (dispatch, getState) => {
    dispatch(requestArtist());
    return fetch("records/artist/" + getState().activeArtist.id + "/get")
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}
