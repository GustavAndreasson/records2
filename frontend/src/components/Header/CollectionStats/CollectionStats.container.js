import { connect } from "react-redux"
import { selectCollectionStats } from "Selectors"
import CollectionStats from "./CollectionStats.component"

const mapStateToProps = state => ({
  collectionStats: selectCollectionStats(state),
})

export default connect(mapStateToProps)(CollectionStats)
