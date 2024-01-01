import { connect } from "react-redux"
import Price from "./Price.component"

const mapStateToProps = state => ({
  rate: state.collection.rate,
})

export default connect(mapStateToProps)(Price)
