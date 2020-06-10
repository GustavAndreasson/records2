import React from "react";
import Record from "./Record";
import "./Collection.scss";

const Collection = ({ collection }) => (
    collection.length > 0  &&
    <div className="collection">
        { collection.map(rec =>
            <Record rec={rec} key={rec.id} />)
        }
    </div>
)

export default Collection;
