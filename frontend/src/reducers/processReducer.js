import { SET_ORDERS, SET_FILTERS, UPDATE_SEARCH, ADD_FILTER } from "Actions"

function process(state = { orders: {}, filters: {}, searchQuery: "" }, action) {
  switch (action.type) {
    case SET_ORDERS:
      return Object.assign({}, state, { orders: action.orders })
    case SET_FILTERS:
      return Object.assign({}, state, { filters: action.filters })
    case UPDATE_SEARCH:
      return Object.assign({}, state, { searchQuery: action.query })
    case ADD_FILTER:
      return state.filters.some(
        f =>
          f.attribute === action.filter.attribute &&
          f.compare === action.filter.compare &&
          f.value === action.filter.value
      )
        ? state
        : Object.assign({}, state, {
            filters: [...state.filters, action.filter],
          })
    default:
      return state
  }
}

export default process
