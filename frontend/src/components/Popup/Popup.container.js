import { connect } from "react-redux"
import { hidePopup } from "Actions"
import Popup from "./Popup.component"

const mapStateToProps = state => ({
  popups: state.ui.popups,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  hidePopup: name => {
    ownProps.hide && ownProps.hide()
    dispatch(hidePopup(name))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Popup)
