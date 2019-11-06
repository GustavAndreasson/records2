import React, { useState } from "react";
import Filter from "../util/Filter";
import "./styling/Filters.scss";

const Filters = ({ filters, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Filter.attributes)[0].key);
    const [compare, setCompare] = useState(Object.values(Filter.attributes)[0].compares[0].key);
    const [value, setValue] = useState("");
    const handleAttributeChange = (event) => setAttribute(Filter.attributes[event.target.value].key);
    const handleCompareChange = (event) => setCompare(Filter.compares[event.target.value].key);
    const handleValueChange = (event) => setValue(event.target.value);
    const handleAddClick = (e) => {
        e.preventDefault();
        handleUpdate(filters.concat({
            attribute: attribute,
            compare: compare,
            value:  value,
            run: Filter.getFunction(attribute, compare, value)
        }));
        setValue("");
    };
    const handleRemoveClick = (index) => handleUpdate(filters.filter((_, i) => i !== index));
    return (
        <div className="filters">
            <div className="current-filters">
                { filters.map((filter, index) =>
                    <div className="filter" key={index}>
                        <span className="attribute">{Filter.attributes[filter.attribute].name}</span>
                        <span className="compare">{Filter.compares[filter.compare].name}</span>
                        <span className="value">{filter.value}</span>
                        <button type="button" className="remove-filter" onClick={() => handleRemoveClick(index)}>-</button>
                    </div>
                )}
            </div>
            <form className="new-filter"  onSubmit={handleAddClick}>
                <select className="filter-attribute" value={attribute.key} onChange={handleAttributeChange}>
                    { Object.values(Filter.attributes).map(attr =>
                        <option value={attr.key} key={attr.key}>{attr.name}</option>
                    )}
                </select>
                <select className="filter-compare" value={compare.key} onChange={handleCompareChange}>
                    { Filter.attributes[attribute].compares.map(cmp =>
                        <option value={cmp.key} key={cmp.key}>{cmp.name}</option>
                    )}
                </select>
                <input type="text" className="filter-value"  value={value} onChange={handleValueChange}/>
                <button type="submit" className="add-filter">+</button>
            </form>
        </div>
    );
}
export default Filters;