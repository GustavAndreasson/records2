import React, { Fragment } from "react";
import { connect } from "react-redux";
import Search from './Search';
import FiltersButton from './FiltersButton';
import OrdersButton from './OrdersButton';
import UpdateButton from './UpdateButton';
import UserButton from './UserButton';
import CollectionStats from './CollectionStats';
import "./styling/Header.scss";

const mapStateToProps = state => ({
    showControls: !!state.collection.discogsUsername
});

const Header = ({ showControls }) => {
    const headerContent = (
        <Fragment>
            <h1>Skivorna</h1>
            {showControls &&
                <Fragment>
                    <Search />
                    <div className="buttons">
                        <FiltersButton />
                        <OrdersButton />
                        <UpdateButton />
                        <UserButton />
                    </div>
                    <CollectionStats />
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

export default connect(mapStateToProps)(Header);
