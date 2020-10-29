import React from "react";
import Popup from "Components/Popup";
import UsernameInput from "Components/UsernameInput";
import ArtistInput from "Components/ArtistInput";
import DirectLink from "./DirectLink";
import "./Settings.scss";

const Settings = () => (
    <Popup name="settings" icon={{icon: "fas fa-cog"}} title="Inställningar">
        <div className="settings">
            <DirectLink />
            <UsernameInput />
            <ArtistInput />
        </div>
    </Popup>
);

export default Settings;
