import { connect } from "react-redux";
import { selectCollection } from "Selectors";
import FilterValue from "./FilterValue.component";

const mapStateToProps = state => ({
    collection: selectCollection(state)
});

export default connect(mapStateToProps)(FilterValue);
