import { connect } from "react-redux"
import { addFilter } from "Actions"
import Genres from "./Genres.component"

const mapDispatchToProps = dispatch => ({
  filterGenre: genre => {
    dispatch(addFilter({ attribute: "genres", compare: "seq", value: genre }))
  },
})

export default connect(null, mapDispatchToProps)(Genres)
