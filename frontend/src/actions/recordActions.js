import api from "Api";

export const SHOW_RECORD = "SHOW_RECORD";
export const showRecord = record => ({
    type: SHOW_RECORD,
    record
})

export const HIDE_RECORD = "HIDE_RECORD";
export const hideRecord = () => ({
    type: HIDE_RECORD
})

export const SHOW_LISTEN = "SHOW_LISTEN";
export const showListen = listen => ({
    type: SHOW_LISTEN,
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
