import React, { Fragment } from "react";
import Search from './Search';
import FiltersButton from './FiltersButton';
import OrdersButton from './OrdersButton';
import UpdateButton from './UpdateButton';
import UserButton from './UserButton';
import ArtistViewButton from './ArtistViewButton';
import CollectionStats from './CollectionStats';
import "./Header.scss";

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
                        <ArtistViewButton />
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

export default Header;
