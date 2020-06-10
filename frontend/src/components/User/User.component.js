import React from "react";
import Popup from "../Popup";
import UsernameInput from "../UsernameInput";
import DirectLink from "./DirectLink";
import "./User.scss";

const User = () => (
    <Popup name="user" icon={{icon: "fas fa-user"}} title="Användare">
        <div className="user">
            <DirectLink />
            <UsernameInput />
        </div>
    </Popup>
);

export default User;
