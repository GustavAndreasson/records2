import React, { useState } from "react";
import { connect } from 'react-redux';
import { setUsername } from '../actions';
import "./styling/UsernameInput.scss";

const mapDispatchToProps = dispatch => ({
    handleSetUsername: user => { dispatch(setUsername(user)) }
});

const ConnectedUsernameInput = ({ handleSetUsername }) => {
    const [user, setUser] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        handleSetUsername(user);
    }
    return (
        <form className="username-input" onSubmit={handleSubmit}>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} />
            <button type="submit">OK</button>
        </form>
    );
}

const UsernameInput = connect(null, mapDispatchToProps)(ConnectedUsernameInput);
export default UsernameInput;
