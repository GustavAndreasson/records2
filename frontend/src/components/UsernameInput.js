import React, { useState } from "react";

const UsernameInput = ({ handleSetUsername }) => {
    const [user, setUser] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        handleSetUsername(user);
    }
    return (
        <form className="usernameInput" onSubmit={handleSubmit}>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} />
            <button type="submit">OK</button>
        </form>
    );
}
export default UsernameInput;
