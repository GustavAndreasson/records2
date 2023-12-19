import { connect } from "react-redux"
import { setGridView, setGridColumns } from "Actions"
import GridSettings from "./GridSettings.component"

const mapStateToProps = state => ({
  gridView: state.ui.gridView,
  gridColumns: state.ui.gridColumns,
})

const mapDispatchToProps = dispatch => ({
  setGridView: gridView => {
    dispatch(setGridView(gridView))
  },
  setGridColumns: gridColumns => {
    dispatch(setGridColumns(gridColumns))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(GridSettings)
