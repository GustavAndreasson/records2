import { connect } from "react-redux"
import { toggleViewArtistCollection } from "Actions"
import ArtistViewButton from "./ArtistViewButton.component"

const mapStateToProps = state => ({
  artist: state.artist.activeArtist,
  discogsUsername: state.collection.discogsUsername,
  viewArtistCollection: state.artist.viewArtistCollection,
  collectionLoading: state.ui.collectionLoading,
})

const mapDispatchToProps = dispatch => ({
  handleShowCollectionClick: () => {
    dispatch(toggleViewArtistCollection())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ArtistViewButton)
