import { connect } from "react-redux"
import { updateRecord, showListen, hideRecord } from "Actions"
import { selectActiveRecord } from "Selectors"
import RecordInfo from "./RecordInfo.component"

const mapStateToProps = state => ({
  rec: selectActiveRecord(state),
  recordsLoading: state.ui.recordsLoading,
  rate: state.collection.rate,
  currency: state.collection.currency,
})

const mapDispatchToProps = dispatch => ({
  updateRecord: record => {
    dispatch(updateRecord(record))
  },
  handleListenClick: listen => {
    dispatch(showListen(listen))
  },
  hideRecord: () => {
    dispatch(hideRecord())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(RecordInfo)
