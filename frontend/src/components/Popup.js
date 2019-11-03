import React from "react";
import "./styling/Popup.scss";

const Popup = ({ children, handleClose }) => (
    <div className="popup">
        <div className="close-button" onClick={handleClose}>{"\u2715"}</div>
        { children }
    </div>
)
export default Popup;
