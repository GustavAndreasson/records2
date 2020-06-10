import React from "react";
import { connect } from "react-redux";
import { getCollection } from "../../actions";
import App from "./App.component";

const mapStateToProps = state => ({
    discogsUsername: state.collection.discogsUsername
});

const mapDispatchToProps = dispatch => ({
    getCollection: user => { dispatch(getCollection(user)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
