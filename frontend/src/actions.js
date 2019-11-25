export const SHOW_RECORD = "SHOW_RECORD";
export const showRecord = record => ({
    type: SHOW_RECORD,
    record
})

export const HIDE_RECORD = "HIDE_RECORD";
export const hideRecord = () => ({
    type: HIDE_RECORD
})

export const SHOW_ARTIST = "SHOW_ARTIST";
export const showArtist = record => ({
    type: SHOW_ARTIST,
    record
})

export const HIDE_ARTIST = "HIDE_ARTIST";
export const hideArtist = () => ({
    type: HIDE_ARTIST
})

export const SET_ORDERS = "SET_ORDERS";
export const setOrders = orders => ({
    type: SET_ORDERS,
    orders
})

export const SET_FILTERS = "SET_FILTERS";
export const setFilters = filters => ({
    type: SET_FILTERS,
    filters
})

export const UPDATE_SEARCH = "UPDATE_SEARCH";
export const updateSearch = query => ({
    type: UPDATE_SEARCH,
    query
})

export const SHOW_FILTERS = "SHOW_FILTERS";
export const showFilters = show => ({
    type: SHOW_FILTERS,
    show
})

export const SHOW_ORDERS = "SHOW_ORDERS";
export const showOrders = show => ({
    type: SHOW_ORDERS,
    show
})

export const REQUEST_COLLECTION = "REQUEST_COLLECTION";
export const requestCollection = () => ({
    type: REQUEST_COLLECTION
})

export const RECEIVE_COLLECTION = "RECEIVE_COLLECTION";
export const receiveCollection = json => ({
    type: RECEIVE_COLLECTION,
    collection: json
})

export const REQUEST_ARTIST = "REQUEST_ARTIST";
export const requestArtist = () => ({
    type: REQUEST_ARTIST
})

export const RECEIVE_ARTIST = "RECEIVE_ARTIST";
export const receiveArtist = json => ({
    type: RECEIVE_ARTIST,
    collection: json
})

export const UPDATE_COLLECTION = "UPDATE_COLLECTION";
export const updateCollection = () => ({
    type: UPDATE_COLLECTION
})

export const SET_USERNAME = "SET_USERNAME";
export const setUsername = user => ({
    type: UPDATE_COLLECTION,
    username
})

export const FILTER_YEAR = "FILTER_YEAR";
export const filterYear = year => ({
    type: FILTER_YEAR,
    year
})
