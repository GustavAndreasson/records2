import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { selectOrderedFilteredCollection } from "../selectors";
import Record from "./Record.js";

const mapStateToProps = state => ({
    collection: selectOrderedFilteredCollection(state)
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
