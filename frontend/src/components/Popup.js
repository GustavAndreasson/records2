import React from "react";
import { connect } from "react-redux";
import { hidePopup } from "../actions";
import "./styling/Popup.scss";

const mapStateToProps = state => ({
    popups: state.ui.popups
});

const mapDispatchToProps = dispatch => ({
    hidePopup: (name) => { dispatch(hidePopup(name)) }
});

const Popup = ({ children, name, icon, title, popups, hidePopup }) => (popups.indexOf(name) === 0 &&
    <div className={"popup " + "level" + name.split(".").length}>
        <div className="popup-header">
            { icon &&
                (icon.image
                    ? <div className="popup-icon"><img src={icon.image} /></div>
                    : icon.icon && <div className={"popup-icon " + icon.icon}></div>
                )
            }
            { title && <div className="popup-title">{title}</div> }
            <div className="close-button fas fa-times" onClick={()=>hidePopup(name)}></div>
        </div>
        <div className="content">{ children }</div>
    </div>
)
export default connect(mapStateToProps, mapDispatchToProps)(Popup);
