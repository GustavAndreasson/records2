import React, { useState } from "react";
import Order from "../util/Order";
import "./styling/Orders.scss";

const Orders = ({ orders, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Order.attributes)[0].key);
    const [reverse, setReverse] = useState(false);
    const handleAttributeChange = (event) => setAttribute(Order.attributes[event.target.value].key);
    const handleReverseChange = (event) => setReverse(event.target.checked);
    const handleAddClick = (e) => {
        e.preventDefault();
        handleUpdate(orders.concat({
            attribute: attribute,
            reverse: reverse,
            run: Order.getFunction(attribute, reverse)
        }));
        setReverse(false);
    };
    const handleRemoveClick = (index) => handleUpdate(orders.filter((_, i) => i !== index));
    return (
        <div className="orders">
            <div className="current-orders">
                { orders.map((order, index) =>
                    <div className="order" key={index}>
                        <span className="attribute">{Order.attributes[order.attribute].name}</span>
                        <span className="direction">{order.reverse ? "\u21e7" : "\u21e9"}</span>
                        <button type="button" className="remove-order" onClick={() => handleRemoveClick(index)}>-</button>
                    </div>
                )}
            </div>
            <form className="new-order" onSubmit={handleAddClick}>
                <select className="order-attribute" value={attribute.key} onChange={handleAttributeChange}>
                    { Object.values(Order.attributes).map(attr =>
                        <option value={attr.key} key={attr.key}>{attr.name}</option>
                    )}
                </select>
                <input type="checkbox" className="order-reverse" id="order-reverse" checked={reverse} onChange={handleReverseChange} />
                <label htmlFor="order-reverse" className="button"></label>
                <button type="submit" className="add-order">+</button>
            </form>
        </div>
    );
}
export default Orders;
