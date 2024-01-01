import { connect } from "react-redux"
import { addFilter } from "Actions"
import Year from "./Year.component"

const mapDispatchToProps = dispatch => ({
  filterYear: year => {
    dispatch(addFilter({ attribute: "year", compare: "eq", value: year }))
  },
})

export default connect(null, mapDispatchToProps)(Year)
