import React from "react"
import { useAppStore } from "Store"
import "./Search.scss"

const Search = ({ showSearch, toggleShowSearch }) => {
  const searchQuery = useAppStore(state => state.searchQuery)
  const setSearchQuery = useAppStore(state => state.setSearchQuery)

  return (
    <div className={"search" + (showSearch ? " show-search" : "")}>
      <button type="button" className="fas fa-search" onClick={toggleShowSearch}></button>
      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      {searchQuery && (
        <span className="clear-search fas fa-times" onClick={() => setSearchQuery("")}></span>
      )}
    </div>
  )
}

export default Search
