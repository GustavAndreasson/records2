import React from "react";
import Search from './Search';
import FiltersButton from './FiltersButton';
import OrdersButton from './OrdersButton';
import UpdateButton from './UpdateButton';
import SettingsButton from './SettingsButton';
import ArtistViewButton from './ArtistViewButton';
import CollectionStats from './CollectionStats';
import "./Header.scss";

const Header = ({ showControls }) => {
    const headerContent = (
        <>
            <h1>Skivorna</h1>
            {showControls &&
                <>
                    <Search />
                    <div className="buttons">
                        <FiltersButton />
                        <OrdersButton />
                        <UpdateButton />
                        <SettingsButton />
                        <ArtistViewButton />
                    </div>
                    <CollectionStats />
                </>
            }
        </>
    );
    return (
        <>
            <header>
                {headerContent}
            </header>
            <div className="header-push">
                {headerContent}
            </div>
        </>
    )
}

export default Header;
