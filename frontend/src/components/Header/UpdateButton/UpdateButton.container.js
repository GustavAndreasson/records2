import React from "react";
import { connect } from "react-redux";
import {
    updateCollection,
    updateRecord,
    updateArtistCollection
} from "../../../actions";
import { selectActiveRecord } from "../../../selectors";
import UpdateButton from "./UpdateButton.component";

const mapStateToProps = state => ({
    collectionLoading: state.ui.collectionLoading,
    activeRecord: selectActiveRecord(state),
    viewArtistCollection: state.artist.viewArtistCollection
});

const mapDispatchToProps = dispatch => ({
    handleUpdateCollection: () => { dispatch(updateCollection()) },
    handleUpdateRecord: (record) => { dispatch(updateRecord(record)) },
    handleUpdateArtistCollection: () => { dispatch(updateArtistCollection()) }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    handleUpdate: (stateProps.activeRecord
        ? () => dispatchProps.handleUpdateRecord(stateProps.activeRecord)
        : (stateProps.viewArtistCollection
            ? dispatchProps.handleUpdateArtistCollection
            : dispatchProps.handleUpdateCollection
        )),
    collectionLoading: stateProps.collectionLoading
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UpdateButton);
