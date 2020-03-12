import React, { useState } from "react";
import { connect } from 'react-redux';
import { getCollection } from '../actions';
import "./styling/UsernameInput.scss";

const mapStateToProps = state => ({
    discogsUsername: state.discogsUsername
});

const mapDispatchToProps = dispatch => ({
    handleUpdateUsername: user => { dispatch(getCollection(user)) }
});

const UsernameInput = ({ discogsUsername, handleUpdateUsername }) => {
    const [user, setUser] = useState(discogsUsername);
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

export default connect(mapStateToProps, mapDispatchToProps)(UsernameInput);
