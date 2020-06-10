import React from "react";
import { connect } from "react-redux";
import { selectDirectLink } from "../../../selectors";
import DirectLink from "./DirectLink.component";

const mapStateToProps = state => ({
    directLink: selectDirectLink(state)
});

export default connect(mapStateToProps)(DirectLink);
