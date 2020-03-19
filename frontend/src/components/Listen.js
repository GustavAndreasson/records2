import React from "react";
import { connect } from "react-redux";
import Popup from "./Popup";
import "./styling/Listen.scss";

const mapStateToProps = state => ({
    listen: state.activeListen
});

const Listen = ({ listen }) => (listen &&
    <Popup name="recordInfo.listen">
        <div className="listen" dangerouslySetInnerHTML={{__html: listen.html}}></div>
    </Popup>
);

export default connect(mapStateToProps)(Listen);
