import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Collection from "./Collection";
const App = () => (
  <DataProvider endpoint="records/collection/gustav.andreasson/get/2" 
                render={data => <Collection col={data} />} />
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
