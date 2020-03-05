import api from '../api';

export const SHOW_RECORD = "SHOW_RECORD";
export const showRecord = record => ({
    type: SHOW_RECORD,
    record
})

export const HIDE_RECORD = "HIDE_RECORD";
export const hideRecord = () => ({
    type: HIDE_RECORD
})

export const REQUEST_RECORD = "REQUEST_RECORD";
export const requestRecord = () => ({
    type: REQUEST_RECORD
})

export const RECEIVE_RECORD = "RECEIVE_RECORD";
export const receiveRecord = json => ({
    type: RECEIVE_RECORD,
    record: json
})

export const getRecord = () => (dispatch, getState) => {
    dispatch(requestRecord());
    api.getRecord(getState().activeRecord.id)
        .then(response => response.json())
        .then(json => dispatch(receiveRecord(json)));
}

export const updateRecord = () => (dispatch, getState) => {
    dispatch(requestRecord());
    api.updateRecord(getState().activeRecord.id)
        .then(response => response.json())
        .then(json => dispatch(receiveRecord(json)));
}