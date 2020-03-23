import React, { Fragment } from "react";
import { connect } from "react-redux";
import { updateSearch, updateCollection, showPopup } from "../actions";
import { selectCollectionStats } from '../selectors';
import "./styling/Header.scss";

const mapStateToProps = state => ({
    showControls: !!state.discogsUsername,
    searchQuery: state.searchQuery,
    qtyFilters: state.filters.length,
    qtyOrders: state.orders.length,
    collectionLoading: state.collectionLoading,
    collectionStats: selectCollectionStats(state)
});

const mapDispatchToProps = dispatch => ({
    handleSearchUpdated: query => { dispatch(updateSearch(query)) },
    handleShowFilters: () => { dispatch(showPopup("filters")) },
    handleShowOrders: () => { dispatch(showPopup("orders")) },
    handleUpdateCollection: () => { dispatch(updateCollection()) },
    handleShowUser: () => { dispatch(showPopup("user")) }
});

const Header = ({
    showControls,
    searchQuery,
    handleSearchUpdated,
    handleShowFilters,
    qtyFilters,
    handleShowOrders,
    qtyOrders,
    handleUpdateCollection,
    collectionLoading,
    handleShowUser,
    collectionStats
}) => {
    const headerContent = (
        <Fragment>
            <h1>Skivorna</h1>
            {showControls &&
                <Fragment>
                    <div className="search">
                        <input type="text" value={searchQuery} onChange={e => handleSearchUpdated(e.target.value)}/>
                        {searchQuery &&
                            <span className="clear-search fas fa-times" onClick={() => handleSearchUpdated("")}></span>
                        }
                    </div>
                    <div className="buttons">
                        <button type="button" className="fas fa-filter" onClick={handleShowFilters}>
                            {qtyFilters > 0 && <span className="button-qty">{qtyFilters}</span>}
                        </button>
                        <button type="button" className="fas fa-sort" onClick={handleShowOrders}>
                            {qtyOrders > 0 && <span className="button-qty">{qtyOrders}</span>}
                        </button>
                        <button
                            type="button"
                            className="fas fa-sync"
                            disabled={collectionLoading}
                            onClick={handleUpdateCollection}
                        ></button>
                        <button type="button" className="fas fa-user" onClick={handleShowUser}></button>
                    </div>
                    {collectionStats &&
                        <div className="stats">
                            <div className="counter">{"Antal skivor: " + collectionStats.qty}</div>
                            <div className="price-sum">{"Pris summa: " + collectionStats.sum}</div>
                            <div className="price-avg">{"Pris medel: " + collectionStats.avg}</div>
                        </div>
                    }
                </Fragment>
            }
        </Fragment>
    );
    return (
        <Fragment>
            <header>
                {headerContent}
            </header>
            <div className="header-push">
                {headerContent}
            </div>
        </Fragment>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
