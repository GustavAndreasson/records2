import { connect } from "react-redux";
import { selectDirectLink } from "Selectors";
import DirectLink from "./DirectLink.component";

const mapStateToProps = state => ({
    directLink: selectDirectLink(state)
});

export default connect(mapStateToProps)(DirectLink);
