import React, { Fragment, useEffect } from "react";
import Header from "Components/Header";
import Collection from "Components/Collection";
import Progress from "Components/Progress";
import RecordInfo from "Components/RecordInfo";
import ArtistInfo from "Components/ArtistInfo";
import UsernameInput from "Components/UsernameInput";
import Filters from "Components/Filters";
import Orders from "Components/Orders";
import User from "Components/User";
import "./App.scss";

const App = ({ discogsUsername, getCollection }) => {
    useEffect(()=>{
        if (discogsUsername) {
            getCollection(discogsUsername);
        }
    }, []);

    return (
        <Fragment>
            <Header />
            <Filters />
            <Orders />
            <User />
            { discogsUsername ?
                <Fragment>
                    <ArtistInfo />
                    <Collection />
                    <RecordInfo />
                    <Progress />
                </Fragment>
            :
                <UsernameInput />
            }
        </Fragment>
    )
}

export default App;
