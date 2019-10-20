import React, { useState } from "react";
import Filter from "../Util/Filter";

const FiltersPopup = ({ filters, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Filter.attributes)[0].key);
    const [compare, setCompare] = useState(Object.values(Filter.attributes)[0].compares[0].key);
    const [value, setValue] = useState("");
    const handleAttributeChange = (event) => setAttribute(event.target.value);
    const handleCompareChange = (event) => setCompare(event.target.value);
    const handleValueChange = (event) => setValue(event.target.value);
    const handleAddClick = () => {
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
                {
                    filters.map((filter, index) =>
                        <div className="filter" key={index}>
                            <span className="attribute">{filter.attribute}</span>
                            <span className="compare">{filter.compare}</span>
                            <span className="value">{filter.value}</span>
                            <button type="button" className="remove_filter" onClick={() => handleRemoveClick(index)}>-</button>
                        </div>
                    )
                }
            </div>
            <div className="new_filter">
                <select className="filter_attribute" value={attribute} onChange={handleAttributeChange}>
                    {
                        Object.values(Filter.attributes).map(attr =>
                            <option value={attr.key} key={attr.key}>{attr.name}</option>
                        )
                    }
                </select>
                <select className="filter_compare" value={compare} onChange={handleCompareChange}>
                    {
                        Filter.attributes[attribute].compares.map(cmp =>
                            <option value={cmp.key} key={cmp.key}>{cmp.name}</option>
                        )
                    }
                </select>
                <input type="text" className="filter_value"  value={value} onChange={handleValueChange}/>
                <button type="button" className="add_filter" onClick={handleAddClick}>+</button>
            </div>
        </div>
    );
}
export default FiltersPopup;
