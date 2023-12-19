import { connect } from "react-redux"
import { getCollection, getArtistCollection, getRate } from "Actions"
import { selectOrderedFilteredCollection } from "Selectors"
import Collection from "./Collection.component"

const mapStateToProps = state => ({
  collection: selectOrderedFilteredCollection(state),
  viewArtistCollection: state.artist.viewArtistCollection,
  activeArtist: state.artist.activeArtist,
  discogsUsername: state.collection.discogsUsername,
  gridView: state.ui.gridView,
  rate: state.collection.rate,
  currency: state.collection.currency,
})

const mapDispatchToProps = dispatch => ({
  getCollection: user => {
    dispatch(getCollection(user))
  },
  getArtistCollection: artist => {
    dispatch(getArtistCollection(artist))
  },
  getRate: currency => {
    dispatch(getRate(currency))
  },
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  collection: stateProps.collection,
  collectionId: stateProps.viewArtistCollection
    ? stateProps.activeArtist
      ? stateProps.activeArtist.id
      : null
    : stateProps.discogsUsername,
  gridView: stateProps.gridView,
  rate: stateProps.rate,
  loadCollection: stateProps.viewArtistCollection
    ? () => dispatchProps.getArtistCollection(stateProps.activeArtist)
    : () => dispatchProps.getCollection(stateProps.discogsUsername),
  loadRate: () => dispatchProps.getRate(stateProps.currency),
  ...ownProps,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Collection)
