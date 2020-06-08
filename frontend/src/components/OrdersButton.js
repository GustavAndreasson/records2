import React from "react";
import { connect } from "react-redux";
import { showPopup } from "../actions";

const mapStateToProps = state => ({
    qtyOrders: state.process.orders.length
});

const mapDispatchToProps = dispatch => ({
    handleShowOrders: () => { dispatch(showPopup("orders")) }
});

const OrdersButton = ({ handleShowOrders, qtyOrders }) => (
    <button type="button" className="fas fa-sort" onClick={handleShowOrders}>
        {qtyOrders > 0 && <span className="button-qty">{qtyOrders}</span>}
    </button>
);

export default connect(mapStateToProps, mapDispatchToProps)(OrdersButton);
