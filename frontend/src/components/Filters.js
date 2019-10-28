import React, { useState } from "react";
import Filter from "../util/Filter";

const Filters = ({ filters, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Filter.attributes)[0]);
    const [compare, setCompare] = useState(Object.values(Filter.attributes)[0].compares[0]);
    const [value, setValue] = useState("");
    const handleAttributeChange = (event) => setAttribute(Filter.attributes[event.target.value]);
    const handleCompareChange = (event) => setCompare(Filter.compares[event.target.value]);
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
        <div className="filtersPopup">
            <div className="filters">
                { filters.map((filter, index) =>
                    <div className="filter" key={index}>
                        <span className="attribute">{filter.attribute.name}</span>
                        <span className="compare">{filter.compare.name}</span>
                        <span className="value">{filter.value}</span>
                        <button type="button" className="remove_filter" onClick={() => handleRemoveClick(index)}>-</button>
                    </div>
                )}
            </div>
            <form className="new_filter"  onSubmit={handleAddClick}>
                <select className="filter_attribute" value={attribute.key} onChange={handleAttributeChange}>
                    { Object.values(Filter.attributes).map(attr =>
                        <option value={attr.key} key={attr.key}>{attr.name}</option>
                    )}
                </select>
                <select className="filter_compare" value={compare.key} onChange={handleCompareChange}>
                    { attribute.compares.map(cmp =>
                        <option value={cmp.key} key={cmp.key}>{cmp.name}</option>
                    )}
                </select>
                <input type="text" className="filter_value"  value={value} onChange={handleValueChange}/>
                <button type="submit" className="add_filter">+</button>
            </form>
        </div>
    );
}
export default Filters;
