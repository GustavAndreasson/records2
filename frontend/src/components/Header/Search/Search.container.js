import React from "react";
import { connect } from "react-redux";
import { updateSearch} from "../../../actions";
import Search from "./Search.component";

const mapStateToProps = state => ({
    searchQuery: state.process.searchQuery
});

const mapDispatchToProps = dispatch => ({
    handleSearchUpdated: query => { dispatch(updateSearch(query)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
