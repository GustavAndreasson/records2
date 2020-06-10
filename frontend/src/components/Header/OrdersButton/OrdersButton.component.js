import React from "react";

const OrdersButton = ({ handleShowOrders, qtyOrders }) => (
    <button type="button" className="fas fa-sort" onClick={handleShowOrders}>
        {qtyOrders > 0 && <span className="button-qty">{qtyOrders}</span>}
    </button>
);

export default OrdersButton;
