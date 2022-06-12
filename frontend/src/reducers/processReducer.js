import { SET_ORDERS, SET_FILTERS, UPDATE_SEARCH, FILTER_YEAR } from "Actions"

function process(state = { orders: {}, filters: {}, searchQuery: "" }, action) {
  switch (action.type) {
    case SET_ORDERS:
      return Object.assign({}, state, { orders: action.orders })
    case SET_FILTERS:
      return Object.assign({}, state, { filters: action.filters })
    case UPDATE_SEARCH:
      return Object.assign({}, state, { searchQuery: action.query })
    case FILTER_YEAR:
      return Object.assign({}, state, {
        filters: [
          ...state.filters,
          {
            attribute: "year",
            compare: "eq",
            value: action.year,
          },
        ],
      })
    default:
      return state
  }
}

export default process
