import React from "react";

const UserButton = ({ handleShowUser }) => (
    <button type="button" className="fas fa-user-cog" onClick={handleShowUser}></button>
)

export default UserButton;
