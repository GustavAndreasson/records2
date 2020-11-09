import React, { useState } from "react";
import Filter from "Utils/Filter";
import AutoSuggest from "react-autosuggest";

const FilterValue = ({ attribute, compare, value, handleValueChange, collection }) => {
    const allValues = (compare === "seq" || compare === "sneq") && collection.flatMap(
        Filter.attributes[attribute].getValues
    ).sort().filter(
        (item, pos, arr) => item && (!pos || item != arr[pos - 1])
    );
    let suggestedValues = allValues && allValues.filter(v => v.toLowerCase().startsWith(value)).slice(0, 10);
    return (
        compare === "seq" || compare === "sneq"
        ? <AutoSuggest
            className="filter-value"
            renderSuggestion={(item, {isHighlighted}) => (
                <div className={isHighlighted ? "highlight" : ""}>
                    {item}
                </div>)}
            getSuggestionValue={item => item}
            onSuggestionsFetchRequested={()=>{}}
            onSuggestionsClearRequested={()=>{}}
            onSuggestionSelected={(e, {suggestionValue}) => handleValueChange(suggestionValue)}
            suggestions={suggestedValues}
            inputProps={{
                placeholder: '',
                value: value,
                onChange: (e, {newValue}) => {
                    handleValueChange(newValue);
                }
            }}
            highlightFirstSuggestion={true}
            alwaysRenderSuggestions={false}
        />
        : <input type="text" className="filter-value" value={value} onChange={e => handleValueChange(e.target.value)}/>
    );
}

export default FilterValue;
