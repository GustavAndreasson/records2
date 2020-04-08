import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { getCollection } from "../actions";
import Header from "./Header";
import Collection from "./Collection";
import Progress from "./Progress";
import RecordInfo from "./RecordInfo";
import ArtistInfo from "./ArtistInfo";
import UsernameInput from "./UsernameInput";
import Filters from "./Filters";
import Orders from "./Orders";
import User from "./User";
import "./styling/App.scss";

const mapStateToProps = state => ({
    discogsUsername: state.collection.discogsUsername
});

const mapDispatchToProps = dispatch => ({
    getCollection: user => { dispatch(getCollection(user)) }
});

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
