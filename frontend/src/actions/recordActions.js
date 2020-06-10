import api from "Api";
import { showPopup } from "./uiActions";

export const SELECT_RECORD = "SELECT_RECORD";
export const selectRecord = record => ({
    type: SELECT_RECORD,
    record
})

export const HIDE_RECORD = "HIDE_RECORD";
export const hideRecord = () => ({
    type: HIDE_RECORD
})

export const SELECT_LISTEN = "SELECT_LISTEN";
export const selectListen = listen => ({
    type: SELECT_LISTEN,
    listen
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

export const RECORD_ERROR = "RECORD_ERROR";
export const recordError = () => ({
    type: RECORD_ERROR
})

export const showListen = (listen) => (dispatch, getState) => {
    dispatch(selectListen(listen));
    dispatch(showPopup("recordInfo.listen"));
}

export const showRecord = (record) => (dispatch, getState) => {
    dispatch(selectRecord(record));
    dispatch(showPopup("recordInfo"));
    let threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    if (!record.updated || record.updated < threeMonthsAgo.toISOString()) {
        dispatch(updateRecord(record));
    }
}

export const getRecord = (record) => async (dispatch, getState) => {
    dispatch(requestRecord());
    try {
        let response = await api.getRecord(record.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveRecord(json));
    } catch (error) {
        dispatch(recordError());
        console.log(error);
    }
}

export const updateRecord = (record) => async (dispatch, getState) => {
    dispatch(requestRecord());
    try {
        let response = await api.updateRecord(record.id);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let json = await response.json();
        dispatch(receiveRecord(json));
    } catch (error) {
        dispatch(recordError());
        console.log(error);
    }
}
