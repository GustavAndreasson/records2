import React from "react";

const FiltersButton = ({ handleShowFilters, qtyFilters }) => (
    <button type="button" className="fas fa-filter" onClick={handleShowFilters}>
        {qtyFilters > 0 && <span className="button-qty">{qtyFilters}</span>}
    </button>
)

export default FiltersButton;
