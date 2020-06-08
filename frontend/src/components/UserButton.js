import React from "react";
import { connect } from "react-redux";
import { showPopup } from "../actions";

const mapDispatchToProps = dispatch => ({
    handleShowUser: () => { dispatch(showPopup("user")) }
});

const UserButton = ({ handleShowUser }) => (
    <button type="button" className="fas fa-user-cog" onClick={handleShowUser}></button>
)

export default connect(null, mapDispatchToProps)(UserButton);
