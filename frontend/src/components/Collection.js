import React, { Fragment } from "react";
import { connect } from 'react-redux';
import Record from "./Record.js";

const mapStateToProps = state => ({
    collection: state.orderedFilteredCollection
});

const ConnectedCollection = ({ collection }) => (
    collection.length > 0  &&
    <div className="collection">
        { collection.map(rec =>
            <Record rec={rec} key={rec.id} />)
        }
    </div>
)

const Collection = connect(mapStateToProps)(ConnectedCollection);
export default Collection;
