import React from "react";
import { connect } from "react-redux";
import { setFilters } from "Actions";
import Filters from "./Filters.component";

const mapStateToProps = state => ({
    filters: state.process.filters
});

const mapDispatchToProps = dispatch => ({
    handleUpdate: filters => { dispatch(setFilters(filters)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
