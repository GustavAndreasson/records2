import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { getCollection } from "../actions";
import Header from "./Header";
import Collection from "./Collection";
import RecordInfo from "./RecordInfo";
import ArtistInfo from "./ArtistInfo";
import UsernameInput from "./UsernameInput";
import Filters from "./Filters";
import Orders from "./Orders";
import User from "./User";
import "./styling/App.scss";

const mapStateToProps = state => ({
    status: state.status,
    discogsUsername: state.discogsUsername
});

const mapDispatchToProps = dispatch => ({
    getCollection: user => { dispatch(getCollection(user)) }
});

const App = ({ status, discogsUsername, getCollection }) => {
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
            { status &&
                <div className="status">{status}</div>
            }
            { discogsUsername ?
                <Fragment>
                    <ArtistInfo />
                    <Collection />
                    <RecordInfo />
                </Fragment>
            :
                <UsernameInput />
            }
        </Fragment>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
