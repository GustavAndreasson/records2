import React from "react";
import { connect } from "react-redux";
import { updateCollection } from "../actions";

const mapStateToProps = state => ({
    collectionLoading: state.ui.collectionLoading
});

const mapDispatchToProps = dispatch => ({
    handleUpdateCollection: () => { dispatch(updateCollection()) }
});

const UpdateButton = ({ handleUpdateCollection, collectionLoading }) => (
    <button
        type="button"
        className="fas fa-sync"
        disabled={collectionLoading}
        onClick={handleUpdateCollection}
    ></button>
)

export default connect(mapStateToProps, mapDispatchToProps)(UpdateButton);
