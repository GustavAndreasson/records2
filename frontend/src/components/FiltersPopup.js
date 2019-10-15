import React, { useState } from "react";

const FiltersPopup = ({ filters, handleUpdate, handleClose }) => {
    return (
        <div className="filtersPopup">
            <div className="filters">
            </div>
            <div className="new_filter">
                <select className="filter_attribute">
                    <option value="name">Album</option>
                    <option value="artist">Artist</option>
                    <option value="format">Format</option>
                    <option value="year">År</option>
                </select>
                <select className="filter_compare">
                    <option value="eq">=</option>
                    <option value="neq">!=</option>
                    <option value="sub">~</option>
                    <option value="lt">&lt;</option>
                    <option value="mt">&gt;</option>
                </select>
                <input type="text" className="filter_value" />
                <button type="button" className="add_filter">+</button>
            </div>
        </div>
    );
}
export default FiltersPopup;
