import { connect } from "react-redux"
import { showRecord } from "Actions"
import Record from "./Record.component"

const mapDispatchToProps = dispatch => ({
  handleClick: rec => {
    dispatch(showRecord(rec))
  },
})

export default connect(null, mapDispatchToProps)(Record)
