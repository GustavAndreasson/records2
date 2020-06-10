import React from "react";
import { connect } from "react-redux";
import { selectOrderedFilteredCollection } from "../../selectors";
import Collection from "./Collection.component";

const mapStateToProps = state => ({
    collection: selectOrderedFilteredCollection(state)
});

export default connect(mapStateToProps)(Collection);
