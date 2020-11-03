import React, { Fragment } from "react";
import Header from "Components/Header";
import Collection from "Components/Collection";
import Progress from "Components/Progress";
import RecordInfo from "Components/RecordInfo";
import ArtistInfo from "Components/ArtistInfo";
import UsernameInput from "Components/UsernameInput";
import ArtistInput from "Components/ArtistInput";
import Filters from "Components/Filters";
import Orders from "Components/Orders";
import Settings from "Components/Settings";
import "./App.scss";

const App = ({
    discogsUsername,
    activeArtist,
    viewArtistCollection
}) => (
    <Fragment>
        <Header />
        <Filters />
        <Orders />
        <Settings />
        { discogsUsername || (activeArtist && viewArtistCollection) ?
            <Fragment>
                <ArtistInfo />
                <Collection />
                <RecordInfo />
                <Progress />
            </Fragment>
        :
            <Fragment>
                <UsernameInput />
                <ArtistInput />
            </Fragment>
        }
    </Fragment>
)

export default App;
