import React from "react";
import { connect } from "react-redux";
import { selectCollectionStats } from '../../../selectors';
import CollectionStats from "./CollectionStats.component";

const mapStateToProps = state => ({
    collectionStats: selectCollectionStats(state)
});

export default connect(mapStateToProps)(CollectionStats);
