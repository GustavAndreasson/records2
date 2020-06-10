import React from "react";
import "./Progress.scss";

const Progress = ({ collectionLoading, progress, status }) => (collectionLoading && progress &&
    <div className="progress">
        { status && <div className="progress-title">{status}</div> }
        { Object.keys(progress).length
            ? Object.keys(progress).map(key =>
                <div className="progress-bar" key={key}>
                    <div className="progress-label">{key}</div>
                    <div className="progress-meter" style={{width: progress[key] + "%"}}></div>
                    <div className="progress-value">{progress[key] + "%"}</div>
                </div>)
            :
                <div className="progress-bar">
                    <div className="progress-auto-meter"></div>
                </div>
        }
    </div>
)

export default Progress;
