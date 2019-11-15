import React from "react";
import "./styling/Popup.scss";

const Popup = ({ children, handleClose }) => (
    <div className="popup">
        <div className="close-button fas fa-times" onClick={handleClose}></div>
        <div className="content">{ children }</div>
    </div>
)
export default Popup;
