import React from "react";
import "./Search.scss";

const Search = ({ searchQuery, handleSearchUpdated }) => (
    <div className="search">
        <input type="text" value={searchQuery} onChange={e => handleSearchUpdated(e.target.value)}/>
        {searchQuery &&
            <span className="clear-search fas fa-times" onClick={() => handleSearchUpdated("")}></span>
        }
    </div>
);

export default Search;
