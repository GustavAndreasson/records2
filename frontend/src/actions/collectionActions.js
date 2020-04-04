import api from "../api";

export const REQUEST_COLLECTION = "REQUEST_COLLECTION";
export const requestCollection = () => ({
    type: REQUEST_COLLECTION
})

export const RECEIVE_COLLECTION = "RECEIVE_COLLECTION";
export const receiveCollection = json => ({
    type: RECEIVE_COLLECTION,
    collection: json
})

export const COLLECTION_ERROR = "COLLECTION_ERROR";
export const collectionError = () => ({
    type: COLLECTION_ERROR
})

export const SET_USERNAME = "SET_USERNAME";
export const setUsername = user => ({
    type: SET_USERNAME,
    user
})

export const UPDATE_PROGRESS = "UPDATE_PROGRESS";
export const updateProgress = progress => ({
    type: UPDATE_PROGRESS,
    progress
})

export const updateUsername = (user) => (dispatch, getState) => {
    dispatch(setUsername(user));
    if (user) {
        dispatch(getCollection(user))
    }
}

export const getCollection = (user) => async (dispatch, getState) => {
    dispatch(requestCollection());
    setTimeout(() => progress(dispatch), 100);
    let progressTimer = setInterval(() => progress(dispatch), 1000);
    try {
        let response = await api.getCollection(user);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveCollection(json));
    } catch (error) {
        dispatch(collectionError());
        console.log(error);
    } finally {
        clearInterval(progressTimer);
    }
}

export const updateCollection = () => async (dispatch, getState) => {
    dispatch(requestCollection());
    setTimeout(() => progress(dispatch), 100);
    let progressTimer = setInterval(() => progress(dispatch), 1000);
    try {
        let response = await api.updateCollection(getState().discogsUsername);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveCollection(json));
    } catch (error) {
        dispatch(collectionError());
        console.log(error);
    } finally {
        clearInterval(progressTimer);
    }
}

const progress = async (dispatch) => {
    try {
        let progressData = await api.getProgress();
        let progressJSON = await progressData.json();
        dispatch(updateProgress(progressJSON));
    } catch (error) {
        dispatch(updateProgress({}));
        console.log(error);
    }
}
