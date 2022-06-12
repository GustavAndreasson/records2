import { connect } from "react-redux"
import Listen from "./Listen.component"

const mapStateToProps = state => ({
  listen: state.collection.activeListen,
})

export default connect(mapStateToProps)(Listen)
