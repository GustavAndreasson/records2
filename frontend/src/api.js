import {
    requestCollection, receiveCollection,
    requestRecord, receiveRecord,
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

export const getRecord = () => (dispatch, getState) => {
    dispatch(requestRecord());
    return fetch("records/record/" + getState().activeRecord.id + "/get")
        .then(response => response.json())
        .then(json => dispatch(receiveRecord(json)));
}

export const getArtist = () => (dispatch, getState) => {
    dispatch(requestArtist());
    return fetch("records/artist/" + getState().activeArtist.id + "/get")
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}

export const updateArtist = () => (dispatch, getState) => {
    dispatch(requestArtist());
    return fetch("records/artist/" + getState().activeArtist.id + "/update")
        .then(response => response.json())
        .then(json => dispatch(receiveArtist(json)));
}
