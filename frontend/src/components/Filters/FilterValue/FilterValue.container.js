import { connect } from "react-redux"
import FilterValue from "./FilterValue.component"

const mapStateToProps = state => ({
  collection: Object.values(
    state.artist.viewArtistCollection ? state.artist.artistCollection : state.collection.collection
  ),
})

export default connect(mapStateToProps)(FilterValue)
