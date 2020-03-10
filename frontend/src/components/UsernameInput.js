import React, { useState } from "react";
import { connect } from 'react-redux';
import { getCollection } from '../actions';
import "./styling/UsernameInput.scss";

const mapDispatchToProps = dispatch => ({
    handleUpdateUsername: user => { dispatch(getCollection(user)) }
});

const ConnectedUsernameInput = ({ handleUpdateUsername }) => {
    const [user, setUser] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        handleUpdateUsername(user);
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
