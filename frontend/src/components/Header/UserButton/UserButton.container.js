import React from "react";
import { connect } from "react-redux";
import { showPopup } from "Actions";
import UserButton from "./UserButton.component";

const mapDispatchToProps = dispatch => ({
    handleShowUser: () => { dispatch(showPopup("user")) }
});

export default connect(null, mapDispatchToProps)(UserButton);
