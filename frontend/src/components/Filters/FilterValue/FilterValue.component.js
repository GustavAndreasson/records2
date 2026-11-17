import React from "react"
import Filter from "Utils/Filter"
import AutoSuggest from "react-autosuggest"
import { useAppStore } from "Store"
import { useCollectionQuery, useArtistCollectionQuery } from "Queries"

const FilterValue = ({ attribute, compare, value, handleValueChange }) => {
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)

  const { data: collectionData } = useCollectionQuery(discogsUsername)
  const { data: artistCollectionData } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )

  const collectionObj = viewArtistCollection ? artistCollectionData : collectionData
  const collection = collectionObj ? Object.values(collectionObj) : []

  const allValues =
    (compare === "seq" || compare === "sneq") &&
    collection
      .flatMap(Filter.attributes[attribute].getValues)
      .sort()
      .filter((item, pos, arr) => item && (!pos || item !== arr[pos - 1]))

  const suggestedValues =
    allValues && allValues.filter(v => v.toLowerCase().startsWith(value.toLowerCase())).slice(0, 10)

  return Filter.attributes[attribute].type === "text" &&
    (compare === "seq" || compare === "sneq") ? (
    <AutoSuggest
      renderSuggestion={(item, { isHighlighted }) => (
        <div className={isHighlighted ? "highlight" : ""}>{item}</div>
      )}
      getSuggestionValue={item => item}
      onSuggestionsFetchRequested={() => {}}
      onSuggestionsClearRequested={() => {}}
      onSuggestionSelected={(e, { suggestionValue }) => handleValueChange(suggestionValue)}
      suggestions={suggestedValues || []}
      inputProps={{
        className: "filter-value",
        placeholder: "",
        value: value,
        onChange: (e, { newValue }) => {
          handleValueChange(newValue)
        },
      }}
      highlightFirstSuggestion={true}
      alwaysRenderSuggestions={false}
    />
  ) : (
    <input
      type={Filter.attributes[attribute].type}
      className="filter-value"
      value={value}
      onChange={e => handleValueChange(e.target.value)}
    />
  )
}

export default FilterValue
