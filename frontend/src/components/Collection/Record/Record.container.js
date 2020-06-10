import React from "react";
import { connect } from "react-redux";
import { showRecord } from "../../../actions";
import Record from "./Record.component";

const mapDispatchToProps = dispatch => ({
    handleClick: rec => { dispatch(showRecord(rec)) }
});

export default connect(null, mapDispatchToProps)(Record);
