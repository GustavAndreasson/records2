import { connect } from "react-redux"
import { addFilter } from "Actions"
import Formats from "./Formats.component"

const mapDispatchToProps = dispatch => ({
  filterFormat: format => {
    dispatch(addFilter({ attribute: "formats", compare: "seq", value: format.name }))
  },
})

export default connect(null, mapDispatchToProps)(Formats)
