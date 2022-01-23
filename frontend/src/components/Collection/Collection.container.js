import { connect } from "react-redux";
import { getCollection, getArtistCollection } from "Actions";
import { selectOrderedFilteredCollection } from "Selectors";
import Collection from "./Collection.component";

const mapStateToProps = state => ({
  collection: selectOrderedFilteredCollection(state),
  viewArtistCollection: state.artist.viewArtistCollection,
  activeArtist: state.artist.activeArtist,
  discogsUsername: state.collection.discogsUsername
});

const mapDispatchToProps = dispatch => ({
  getCollection: user => { dispatch(getCollection(user)) },
  getArtistCollection: artist => { dispatch(getArtistCollection(artist)) }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  collection: stateProps.collection,
  collectionId: (stateProps.viewArtistCollection
    ? (stateProps.activeArtist ? stateProps.activeArtist.id : null)
    : stateProps.discogsUsername),
  loadCollection: (stateProps.viewArtistCollection
    ? () => dispatchProps.getArtistCollection(stateProps.activeArtist)
    : () => dispatchProps.getCollection(stateProps.discogsUsername)
  ),
  ...ownProps
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Collection);
