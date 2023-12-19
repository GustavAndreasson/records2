import { connect } from "react-redux"
import { showRecord, filterYear } from "Actions"
import Record from "./Record.component"

const mapStateToProps = state => ({
  gridView: state.ui.gridView,
  gridColumns: state.ui.gridColumns,
  rate: state.collection.rate,
})

const mapDispatchToProps = dispatch => ({
  handleClick: rec => {
    dispatch(showRecord(rec))
  },
  handleYearClick: year => {
    dispatch(filterYear(year))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Record)
