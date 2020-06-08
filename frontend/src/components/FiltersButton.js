import React from "react";
import { connect } from "react-redux";
import { showPopup } from "../actions";

const mapStateToProps = state => ({
    qtyFilters: state.process.filters.length
});

const mapDispatchToProps = dispatch => ({
    handleShowFilters: () => { dispatch(showPopup("filters")) }
});

const FiltersButton = ({ handleShowFilters, qtyFilters }) => (
    <button type="button" className="fas fa-filter" onClick={handleShowFilters}>
        {qtyFilters > 0 && <span className="button-qty">{qtyFilters}</span>}
    </button>
)

export default connect(mapStateToProps, mapDispatchToProps)(FiltersButton);
