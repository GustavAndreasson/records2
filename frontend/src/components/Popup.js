import React from "react";
import { connect } from "react-redux";
import { hidePopup } from "../actions";
import "./styling/Popup.scss";

const mapStateToProps = state => ({
    popups: state.popups
});

const mapDispatchToProps = dispatch => ({
    hidePopup: (name) => { dispatch(hidePopup(name)) }
});

const Popup = ({ children, name, popups, hidePopup }) => (popups.indexOf(name) === 0 &&
    <div className={"popup " + "level" + name.split(".").length}>
        <div className="close-button fas fa-times" onClick={()=>hidePopup(name)}></div>
        <div className="content">{ children }</div>
    </div>
)
export default connect(mapStateToProps, mapDispatchToProps)(Popup);
