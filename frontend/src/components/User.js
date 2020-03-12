import React, { useState } from "react";
import { connect } from 'react-redux';
import { showUser } from '../actions';
import Popup from "./Popup";
import UsernameInput from "./UsernameInput";
import "./styling/User.scss";

const mapStateToProps = state => ({
    showUser: state.showUser
});

const mapDispatchToProps = dispatch => ({
    hideUser: () => { dispatch(showUser(false)) }
});

const User = ({ showUser, hideUser }) => {
    return (
        showUser &&
        <Popup handleClose={hideUser}>
            <div className="user">
                <UsernameInput />
            </div>
        </Popup>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
