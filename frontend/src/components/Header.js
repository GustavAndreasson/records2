import React, { Fragment } from "react";
import "./styling/Header.scss";

const Header = ({ showControls, searchQuery, handleSearchUpdated, handleShowFilters, handleShowOrders, handleUpdateCollection, collectionStats }) => (
    <header>
        <h1>Skivorna</h1>
        { showControls &&
            <Fragment>
                <div className="search">
                    <input type="text" value={searchQuery} onChange={handleSearchUpdated} />
                </div>
                <div className="buttons">
                    <button type="button" onClick={handleShowFilters}>&#9660;</button>
                    <button type="button" onClick={handleShowOrders}>&#8645;</button>
                    <button type="button" onClick={handleUpdateCollection}>&#8635;</button>
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
