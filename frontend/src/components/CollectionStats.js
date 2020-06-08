import React from "react";
import { connect } from "react-redux";
import { selectCollectionStats } from '../selectors';
import "./styling/CollectionStats.scss";

const mapStateToProps = state => ({
    collectionStats: selectCollectionStats(state)
});

const CollectionStats = ({ collectionStats }) => ( collectionStats &&
    <div className="collection-stats">
        <div className="counter">{"Antal skivor: " + collectionStats.qty}</div>
        <div className="price-sum">{"Pris summa: " + collectionStats.sum}</div>
        <div className="price-avg">{"Pris medel: " + collectionStats.avg}</div>
    </div>
)

export default connect(mapStateToProps)(CollectionStats);
