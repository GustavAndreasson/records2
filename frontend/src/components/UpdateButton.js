import React from "react";
import { connect } from "react-redux";
import { updateCollection, updateArtistCollection } from "../actions";

const mapStateToProps = state => ({
    collectionLoading: state.ui.collectionLoading,
    viewArtistCollection: state.artist.viewArtistCollection
});

const mapDispatchToProps = dispatch => ({
    handleUpdateCollection: () => { dispatch(updateCollection()) },
    handleUpdateArtistCollection: () => { dispatch(updateArtistCollection()) }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    handleUpdate: stateProps.viewArtistCollection ? dispatchProps.handleUpdateArtistCollection : dispatchProps.handleUpdateCollection,
    collectionLoading: stateProps.collectionLoading
})

const UpdateButton = ({ handleUpdate, collectionLoading }) => (
    <button
        type="button"
        className="fas fa-sync"
        disabled={collectionLoading}
        onClick={handleUpdate}
    ></button>
)

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UpdateButton);
