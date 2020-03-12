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
    user
})

export const SHOW_USER = "SHOW_USER";
export const showUser = show => ({
    type: SHOW_USER,
    show
})

export const getCollection = (user) => async (dispatch, getState) => {
    dispatch(setUsername(user));
    if (user) {
        dispatch(requestCollection());
        let response = await api.getCollection(user);
        let json = await response.json();
        dispatch(receiveCollection(json));
    }
}

export const updateCollection = (user) => async (dispatch, getState) => {
    dispatch(requestCollection());
    let response = await api.updateCollection(user)
    let json = await response.json();
    dispatch(receiveCollection(json));
}
