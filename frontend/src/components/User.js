import React from "react";
import Popup from "./Popup";
import UsernameInput from "./UsernameInput";
import DirectLink from "./DirectLink";
import "./styling/User.scss";

const User = () => (
    <Popup name="user" icon={{icon: "fas fa-user"}}>
        <div className="user">
            <DirectLink />
            <UsernameInput />
        </div>
    </Popup>
);

export default User;
