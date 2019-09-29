import React, { Component } from "react";
import ReactDOM from "react-dom";
import Collection from "./Collection";

class App extends Component {
    state = {
        data: [],
        loaded: false,
        placeholder: "Loading..."
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
    render() {
        const { data, loaded, placeholder } = this.state;
        return loaded ? <Collection col={data} /> : placeholder;
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
