import React, { useState } from "react";
import { connect } from "react-redux";
import { setOrders } from "../actions";
import Popup from "./Popup";
import Order from "../util/Order";
import "./styling/Orders.scss";

const mapStateToProps = state => ({
    orders: state.orders
});

const mapDispatchToProps = dispatch => ({
    handleUpdate: orders => { dispatch(setOrders(orders)) }
});

const Orders = ({ showOrders, orders, handleUpdate }) => {
    const [attribute, setAttribute] = useState(Object.values(Order.attributes)[0].key);
    const [reverse, setReverse] = useState(false);
    const handleAttributeChange = (event) => setAttribute(Order.attributes[event.target.value].key);
    const handleReverseChange = (event) => setReverse(event.target.checked);
    const handleAddClick = (e) => {
        e.preventDefault();
        handleUpdate(orders.concat({
            attribute: attribute,
            reverse: reverse
        }));
        setReverse(false);
    };
    const handleRemoveClick = (index) => handleUpdate(orders.filter((_, i) => i !== index));
    return (
        <Popup name="orders">
            <div className="orders">
                <div className="current-orders">
                    { orders.map((order, index) =>
                        <div className="order" key={index}>
                            <span className="attribute">{Order.attributes[order.attribute].name}</span>
                            <i className={"direction fas " + (order.reverse ? "fa-sort-up" : "fa-sort-down")}></i>
                            <button type="button" className="remove-order fas fa-minus" onClick={() => handleRemoveClick(index)}></button>
                        </div>
                    )}
                </div>
                <form className="new-order" onSubmit={handleAddClick}>
                    <select className="order-attribute" value={attribute.key} onChange={handleAttributeChange}>
                        { Object.values(Order.attributes).map(attr => attr.key !== "id" &&
                            <option value={attr.key} key={attr.key}>{attr.name}</option>
                        )}
                    </select>
                    <input type="checkbox" className="order-reverse" id="order-reverse" checked={reverse} onChange={handleReverseChange} />
                    <label htmlFor="order-reverse" className="button fas"></label>
                    <button type="submit" className="add-order fas fa-plus"></button>
                </form>
            </div>
        </Popup>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
