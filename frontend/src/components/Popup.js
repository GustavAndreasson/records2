import React from "react";
import "./styling/Popup.scss";

const Popup = ({ children, handleClose }) => (
    <div className="popup">
        <div className="close-button" onClick={handleClose}>X</div>
        { children }
    </div>
)
export default Popup;
