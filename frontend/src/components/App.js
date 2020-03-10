import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCollection } from "../actions";
import Header from "./Header";
import Collection from "./Collection";
import RecordInfo from "./RecordInfo";
import ArtistInfo from "./ArtistInfo";
import UsernameInput from "./UsernameInput";
import Filters from "./Filters";
import Orders from "./Orders";
import "./styling/App.scss";

const mapStateToProps = state => ({
    status: state.status,
    discogsUsername: state.discogsUsername
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getCollection: getCollection
}, dispatch);

class App extends Component {
    componentDidMount() {
        const { getCollection, discogsUsername } = this.props;
        if (discogsUsername) {
            getCollection(discogsUsername);
        }
    }

    render() {
        const {
            status,
            discogsUsername
        } = this.props;

        return (
            <Fragment>
                <Header />
                <Filters />
                <Orders />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
