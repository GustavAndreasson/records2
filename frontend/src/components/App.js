import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Record from "./Record";
import RecordPopup from "./RecordPopup";

class App extends Component {
    state = {
        collection: {},
        loaded: false,
        placeholder: "Loading...",
        activeRecord: null
    };
    componentDidMount() {
        fetch("records/collection/gustav.andreasson/get/2")
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
        })
        .then(data => this.setState({ collection: data, loaded: true }));
    }
    handleRecordClick = (rec) => this.setState({activeRecord: rec});
    render() {
        const { collection, loaded, placeholder, activeRecord } = this.state;
        return (
            <Fragment>
                { loaded ?
		    <div className="collection">
		        { collection && Object.values(collection).map((rec) => <Record rec={rec} handleClick={this.handleRecordClick} key={rec.id} />, this) }
		    </div>
		    : placeholder }
                { activeRecord && <RecordPopup rec={activeRecord} /> }
            </Fragment>
        )
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
