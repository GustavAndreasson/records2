import React, { useState } from "react"
import "./Search.scss"

const Search = ({ searchQuery, handleSearchUpdated }) => {
  const [showSearch, setShowSearch] = useState(false)
  const toggleShowSearch = () => setShowSearch(!showSearch)
  return (
    <div className={"search" + (showSearch ? " show-search" : "")}>
      <button type="button" className="fas fa-search" onClick={toggleShowSearch}></button>
      <input type="text" value={searchQuery} onChange={e => handleSearchUpdated(e.target.value)} />
      {searchQuery && (
        <span className="clear-search fas fa-times" onClick={() => handleSearchUpdated("")}></span>
      )}
    </div>
  )
}

export default Search
