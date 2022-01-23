import { connect } from "react-redux";
import { showPopup } from "Actions";
import SettingsButton from "./SettingsButton.component";

const mapDispatchToProps = dispatch => ({
    handleShowSettings: () => { dispatch(showPopup("settings")) }
});

export default connect(null, mapDispatchToProps)(SettingsButton);
