import { connect } from "react-redux"
import { setUsername } from "Actions"
import UsernameInput from "./UsernameInput.component"

const mapStateToProps = state => ({
  discogsUsername: state.collection.discogsUsername,
})

const mapDispatchToProps = dispatch => ({
  handleUpdateUsername: user => {
    dispatch(setUsername(user))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(UsernameInput)
