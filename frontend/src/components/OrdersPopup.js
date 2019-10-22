import React, { useState } from "react";
import Order from "../util/Order";

const OrdersPopup = ({ orders, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Order.attributes)[0]);
    const [reverse, setReverse] = useState(false);
    const handleAttributeChange = (event) => setAttribute(Order.attributes[event.target.value]);
    const handleReverseChange = (event) => setReverse(event.target.checked);
    const handleAddClick = () => {
        handleUpdate(orders.concat({
            attribute: attribute,
            reverse: reverse,
            run: Order.getFunction(attribute, reverse)
        }));
        setReverse(false);
    };
    const handleRemoveClick = (index) => handleUpdate(orders.filter((_, i) => i !== index));
    return (
        <div className="ordersPopup">
            <div className="orders">
                { orders.map((order, index) =>
                    <div className="order" key={index}>
                        <span className="attribute">{order.attribute.name}</span>
                        <span className="direction">{order.reverse ? "N" : "U"}</span>
                        <button type="button" className="remove_order" onClick={() => handleRemoveClick(index)}>-</button>
                    </div>
                )}
            </div>
            <div className="new_order">
                <select className="order_attribute" value={attribute.key} onChange={handleAttributeChange}>
                    { Object.values(Order.attributes).map(attr =>
                        <option value={attr.key} key={attr.key}>{attr.name}</option>
                    )}
                </select>
                <input type="checkbox" className="order_reverse" checked={reverse} onChange={handleReverseChange} />
                <button type="button" className="add_order" onClick={handleAddClick}>+</button>
            </div>
        </div>
    );
}
export default OrdersPopup;
