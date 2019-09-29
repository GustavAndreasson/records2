import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import Collection from "./Collection";
import RecordPopup from "./RecordPopup";

class App extends Component {
    state = {
        data: [],
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
        .then(data => this.setState({ data: data, loaded: true }));
    }
    handleRecordClick = (rec) => this.setState({activeRecord: rec});
    render() {
        const { data, loaded, placeholder, activeRecord } = this.state;
        return (
            <Fragment>
                { loaded ? <Collection col={data} handleRecordClick={this.handleRecordClick} /> : placeholder }
                { activeRecord && <RecordPopup rec={activeRecord} /> }
            </Fragment>
        )
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;