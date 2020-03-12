import React, { useState } from "react";
import { connect } from 'react-redux';
import { setFilters, showFilters } from '../actions';
import Popup  from "./Popup";
import Filter from "../util/Filter";
import "./styling/Filters.scss";

const mapStateToProps = state => ({
    showFilters: state.showFilters,
    filters: state.filters
});

const mapDispatchToProps = dispatch => ({
    hideFilters: () => { dispatch(showFilters(false)) },
    handleUpdate: filters => { dispatch(setFilters(filters)) }
});

const Filters = ({ showFilters, filters, hideFilters, handleUpdate }) => {
    const [attribute, setAttribute] = useState(Object.values(Filter.attributes)[0].key);
    const [compare, setCompare] = useState(Object.values(Filter.attributes)[0].compares[0].key);
    const [value, setValue] = useState("");
    const handleAttributeChange = (event) => {
        setAttribute(event.target.value);
        setCompare(Filter.attributes[event.target.value].compares[0].key)
    }
    const handleCompareChange = (event) => setCompare(event.target.value);
    const handleValueChange = (event) => setValue(event.target.value);
    const handleAddClick = (e) => {
        e.preventDefault();
        handleUpdate(filters.concat({
            attribute: attribute,
            compare: compare,
            value:  value
        }));
        setValue("");
    };
    const handleRemoveClick = (index) => handleUpdate(filters.filter((_, i) => i !== index));
    return (
        showFilters &&
        <Popup handleClose={hideFilters}>
            <div className="filters">
                <div className="current-filters">
                    { filters.map((filter, index) =>
                        <div className="filter" key={index}>
                            <span className="attribute">{Filter.attributes[filter.attribute].name}</span>
                            <span className="compare">{Filter.compares[filter.compare].name}</span>
                            <span className="value">{filter.value}</span>
                            <button type="button" className="remove-filter fas fa-minus" onClick={() => handleRemoveClick(index)}></button>
                        </div>
                    )}
                </div>
                <form className="new-filter"  onSubmit={handleAddClick}>
                    <select className="filter-attribute" value={attribute} onChange={handleAttributeChange}>
                        { Object.values(Filter.attributes).map(attr =>
                            <option value={attr.key} key={attr.key}>{attr.name}</option>
                        )}
                    </select>
                    <select className="filter-compare" value={compare} onChange={handleCompareChange}>
                        { Filter.attributes[attribute].compares.map(cmp =>
                            <option value={cmp.key} key={cmp.key}>{cmp.name}</option>
                        )}
                    </select>
                    <input type="text" className="filter-value"  value={value} onChange={handleValueChange}/>
                    <button type="submit" className="add-filter fas fa-plus"></button>
                </form>
            </div>
        </Popup>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
