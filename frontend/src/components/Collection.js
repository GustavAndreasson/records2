import React, { Fragment } from "react";
import { connect } from "react-redux";
import { selectOrderedFilteredCollection } from "../selectors";
import Record from "./Record";
import "./styling/Collection.scss";

const mapStateToProps = state => ({
    collection: selectOrderedFilteredCollection(state)
});

const Collection = ({ collection }) => (
    collection.length > 0  &&
    <div className="collection">
        { collection.map(rec =>
            <Record rec={rec} key={rec.id} />)
        }
    </div>
)

export default connect(mapStateToProps)(Collection);
