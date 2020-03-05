import api from '../api';

export const REQUEST_COLLECTION = "REQUEST_COLLECTION";
export const requestCollection = () => ({
    type: REQUEST_COLLECTION
})

export const RECEIVE_COLLECTION = "RECEIVE_COLLECTION";
export const receiveCollection = json => ({
    type: RECEIVE_COLLECTION,
    collection: json
})

export const SET_USERNAME = "SET_USERNAME";
export const setUsername = user => ({
    type: SET_USERNAME,
    username
})

export const getCollection = () => (dispatch, getState) => {
    dispatch(requestCollection());
    api.getCollection(getState().discogsUsername)
        .then(response => response.json())
        .then(json => dispatch(receiveCollection(json)));
}

export const updateCollection = () => (dispatch, getState) => {
    dispatch(requestCollection());
    api.updateCollection(getState().discogsUsername)
        .then(response => response.json())
        .then(json => dispatch(receiveCollection(json)));
}