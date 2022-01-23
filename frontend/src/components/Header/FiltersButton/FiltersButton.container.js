import { connect } from "react-redux";
import { showPopup } from "Actions";
import FiltersButton from "./FiltersButton.component";

const mapStateToProps = state => ({
    qtyFilters: state.process.filters.length
});

const mapDispatchToProps = dispatch => ({
    handleShowFilters: () => { dispatch(showPopup("filters")) }
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltersButton);
