import { connect } from "react-redux";
import Progress from "./Progress.component";

const mapStateToProps = state => ({
    collectionLoading: state.ui.collectionLoading,
    progress: state.ui.progress,
    status: state.ui.status
});

export default connect(mapStateToProps)(Progress);
