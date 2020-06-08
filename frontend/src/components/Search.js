import React from "react";
import { connect } from "react-redux";
import { updateSearch} from "../actions";
import "./styling/Search.scss";

const mapStateToProps = state => ({
    searchQuery: state.process.searchQuery
});

const mapDispatchToProps = dispatch => ({
    handleSearchUpdated: query => { dispatch(updateSearch(query)) }
});

const Search = ({ searchQuery, handleSearchUpdated }) => (
    <div className="search">
        <input type="text" value={searchQuery} onChange={e => handleSearchUpdated(e.target.value)}/>
        {searchQuery &&
            <span className="clear-search fas fa-times" onClick={() => handleSearchUpdated("")}></span>
        }
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Search);
