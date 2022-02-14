import { connect } from "react-redux";
import { updateRecord, filterYear, showListen, hideRecord } from "Actions";
import { selectActiveRecord } from "Selectors";
import RecordInfo from "./RecordInfo.component";

const mapStateToProps = state => ({
    rec: selectActiveRecord(state),
    rate: state.collection.rate,
    currency: state.collection.currency
});

const mapDispatchToProps = dispatch => ({
    updateRecord: record => { dispatch(updateRecord(record)) },
    handleYearClick: year => { dispatch(filterYear(year)) },
    handleListenClick: listen => { dispatch(showListen(listen)) },
    hideRecord: () => { dispatch(hideRecord()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecordInfo);
