import React, { useEffect } from "react";
import { forceCheck } from "react-lazyload";
import Record from "./Record";
import "./Collection.scss";

const Collection = ({ collection, collectionId, loadCollection }) => {
  useEffect(() => {
    if (!collection) {
      loadCollection();
    }
  }, [collectionId]);

  useEffect(() => {
    forceCheck();
  }, [collection]);

  return (
    collection &&
    <div className="collection">
      {collection.map(rec =>
        <Record rec={rec} key={rec.id} />)
      }
    </div>
  )
}

export default Collection;
