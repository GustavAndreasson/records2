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

export const FILTER_YEAR = "FILTER_YEAR";
export const filterYear = year => ({
    type: FILTER_YEAR,
    year
})
