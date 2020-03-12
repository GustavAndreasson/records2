import React from "react";
import Popup from "./Popup";
import UsernameInput from "./UsernameInput";
import "./styling/User.scss";

const User = () => (
    <Popup name="user">
        <div className="user">
            <UsernameInput />
        </div>
    </Popup>
);

export default User;
