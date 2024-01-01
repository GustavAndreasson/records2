import { connect } from "react-redux"
import { showRecord } from "Actions"
import Record from "./Record.component"

const mapStateToProps = state => ({
  gridView: state.ui.gridView,
  gridColumns: state.ui.gridColumns,
})

const mapDispatchToProps = dispatch => ({
  handleClick: rec => {
    dispatch(showRecord(rec))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Record)
