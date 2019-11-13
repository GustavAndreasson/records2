import React, { Fragment } from "react";
import "./styling/Header.scss";

const Header = ({ showControls, searchQuery, handleSearchUpdated, handleShowFilters, qtyFilters, handleShowOrders, qtyOrders,
    handleUpdateCollection, collectionStats }) => (
    <header>
        <h1>Skivorna</h1>
        { showControls &&
            <Fragment>
                <div className="search">
                    <input type="text" value={searchQuery} onChange={handleSearchUpdated} />
                </div>
                <div className="buttons">
                    <button type="button" className="fas fa-filter" onClick={handleShowFilters}>
                        { qtyFilters > 0 && <span className="button-qty">{qtyFilters}</span> }
                    </button>
                    <button type="button" className="fas fa-sort" onClick={handleShowOrders}>
                        { qtyOrders > 0 && <span className="button-qty">{qtyOrders}</span> }
                    </button>
                    <button type="button" className="fas fa-sync" onClick={handleUpdateCollection}></button>
                </div>
                { collectionStats &&
                    <div className="stats">
                        <div className="counter">{"Antal skivor: " + collectionStats.qty}</div>
                        <div className="price-sum">{"Pris summa: " + collectionStats.sum}</div>
                        <div className="price-avg">{"Pris medel: " + collectionStats.avg}</div>
                    </div>
                }
            </Fragment>
        }
    </header>
)
export default Header;
