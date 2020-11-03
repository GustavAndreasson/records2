import React, { useEffect } from "react";
import Record from "./Record";
import "./Collection.scss";

const Collection = ({ collection, loadCollection }) => {
    useEffect(() => {
        if (!collection) {
            loadCollection();
        }
    });

    return (
        collection &&
        <div className="collection">
            { collection.map(rec =>
                <Record rec={rec} key={rec.id} />)
            }
        </div>
    )
}

export default Collection;
