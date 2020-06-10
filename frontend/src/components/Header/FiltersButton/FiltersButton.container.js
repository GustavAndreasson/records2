import React from "react";
import { connect } from "react-redux";
import { showPopup } from "../../../actions";
import FiltersButton from "./FiltersButton.component";

const mapStateToProps = state => ({
    qtyFilters: state.process.filters.length
});

const mapDispatchToProps = dispatch => ({
    handleShowFilters: () => { dispatch(showPopup("filters")) }
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltersButton);
