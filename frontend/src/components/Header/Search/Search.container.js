import { connect } from "react-redux"
import { updateSearch } from "Actions"
import Search from "./Search.component"

const mapStateToProps = state => ({
  searchQuery: state.process.searchQuery,
})

const mapDispatchToProps = dispatch => ({
  handleSearchUpdated: query => {
    dispatch(updateSearch(query))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
