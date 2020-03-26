import React from "react";
import { connect } from "react-redux";
import "./styling/Progress.scss";

const mapStateToProps = state => ({
    collectionLoading: state.collectionLoading,
    progress: state.progress
});

const Progress = ({ collectionLoading, progress }) => (collectionLoading && progress &&
    <div className="progress">
        <div className="progress-bar" style={{width: progress.progress + "%"}}></div>
    </div>
)

export default connect(mapStateToProps)(Progress);
