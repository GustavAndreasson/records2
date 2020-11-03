import React from "react";
import { connect } from "react-redux";
import { updateRecord, filterYear, showListen } from "Actions";
import { selectActiveRecord } from "Selectors";
import RecordInfo from "./RecordInfo.component";

const mapStateToProps = state => ({
    rec: selectActiveRecord(state)
});

const mapDispatchToProps = dispatch => ({
    updateRecord: record => { dispatch(updateRecord(record)) },
    handleYearClick: year => { dispatch(filterYear(year)) },
    handleListenClick: listen => { dispatch(showListen(listen)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(RecordInfo);
