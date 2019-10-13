import React, { useState } from "react";

const UsernameInput = ({ handleClick }) => {
    const [user, setUser] = useState("");
    return (
        <div className="usernameInput">
            <input type="text" value={user} onChange={e => setUser(e.target.value)} />
            <button type="button" onClick={() => handleClick(user)}>OK</button>
        </div>
    );
}
export default UsernameInput;
