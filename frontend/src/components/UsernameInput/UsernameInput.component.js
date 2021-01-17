import React, { useState } from "react";
import "./UsernameInput.scss";

const UsernameInput = ({ discogsUsername, handleUpdateUsername }) => {
    const [user, setUser] = useState(discogsUsername);
    const handleSubmit = e => {
        e.preventDefault();
        handleUpdateUsername(user);
    }
    return (
        <form className="username-input" onSubmit={handleSubmit}>
            <i className="fas fa-user"></i>
            <input type="text" placeholder="Discogs användarnamn" value={user} onChange={e => setUser(e.target.value)} />
            <button type="submit" disabled={!user.length}>OK</button>
        </form>
    );
}

export default UsernameInput;
