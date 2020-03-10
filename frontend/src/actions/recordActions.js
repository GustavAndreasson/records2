import api from '../api';

export const SELECT_RECORD = "SELECT_RECORD";
export const selectRecord = record => ({
    type: SELECT_RECORD,
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

export const showRecord = (record) => (dispatch, getState) => {
    dispatch(selectRecord(record));
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    if (!record.updated || record.updated < threeMonthsAgo.toISOString()) {
        dispatch(updateRecord(record));
    }
}

export const getRecord = (record) => async (dispatch, getState) => {
    dispatch(requestRecord());
    let response = await api.getRecord(record.id);
    let json = await response.json();
    dispatch(receiveRecord(json));
}

export const updateRecord = (record) => async (dispatch, getState) => {
    dispatch(requestRecord());
    let response = await api.updateRecord(record.id);
    let json = await response.json();
    dispatch(receiveRecord(json));
}
