import React from "react";
import "./CollectionStats.scss";

const CollectionStats = ({ collectionStats }) => ( collectionStats &&
    <div className="collection-stats">
        <div className="counter">{"Antal skivor: " + collectionStats.qty}</div>
        <div className="price-sum">{"Pris summa: " + collectionStats.sum}</div>
        <div className="price-avg">{"Pris medel: " + collectionStats.avg}</div>
    </div>
)

export default CollectionStats;
