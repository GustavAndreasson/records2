import React from "react";
import { connect } from "react-redux";
import { setOrders } from "../../actions";
import Orders from "./Orders.component";

const mapStateToProps = state => ({
    orders: state.process.orders
});

const mapDispatchToProps = dispatch => ({
    handleUpdate: orders => { dispatch(setOrders(orders)) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
