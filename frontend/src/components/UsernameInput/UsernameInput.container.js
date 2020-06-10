import React from "react";
import { connect } from "react-redux";
import { updateUsername } from "Actions";
import UsernameInput from "./UsernameInput.component";

const mapStateToProps = state => ({
    discogsUsername: state.collection.discogsUsername
});

const mapDispatchToProps = dispatch => ({
    handleUpdateUsername: user => { dispatch(updateUsername(user)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(UsernameInput);
