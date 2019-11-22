import {
    SHOW_RECORD,
    HIDE_RECORD,
    SHOW_ARTIST,
    HIDE_ARTIST,
    SET_ORDERS,
    SET_FILTERS,
    UPDATE_SEARCH,
    SHOW_FILTERS,
    SHOW_ORDERS,
    UPDATE_COLLECTION,
    SET_USERNAME,
    FILTER_YEAR
} from "../constants/action-types";

export const showRecord = record => ({
    type: SHOW_RECORD,
    record
})

export const hideRecord = () => ({
    type: HIDE_RECORD
})

export const showArtist = record => ({
    type: SHOW_ARTIST,
    record
})

export const hideArtist = () => ({
    type: HIDE_ARTIST
})

export const setOrders = orders => ({
    type: SET_ORDERS,
    orders
})

export const setFilters = filters => ({
    type: SET_FILTERS,
    filters
})

export const updateSearch = query => ({
    type: UPDATE_SEARCH,
    query
})

export const showFilters = show => ({
    type: SHOW_FILTERS,
    show
})

export const showOrders = show => ({
    type: SHOW_ORDERS,
    show
})

export const updateCollection = () => ({
    type: UPDATE_COLLECTION
})

export const setUsername = user => ({
    type: UPDATE_COLLECTION,
    username
})

export const filterYear = year => ({
    type: FILTER_YEAR,
    year
})
