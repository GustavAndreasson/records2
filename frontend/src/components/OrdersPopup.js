import React, { useState } from "react";
import Order from "../util/Order";

const OrdersPopup = ({ orders, handleUpdate, handleClose }) => {
    const [attribute, setAttribute] = useState(Object.values(Order.attributes)[0]);
    const [direction, setDirection] = useState(1);
    const handleAttributeChange = (event) => setAttribute(Order.attributes[event.target.value]);
    const handleDirectionChange = (event) => setDirection(event.target.value);
    const handleAddClick = () =>
        handleUpdate(orders.concat({
            attribute: attribute,
            direction: direction,
            run: Order.getFunction(attribute, direction)
        }));
    const handleRemoveClick = (index) => handleUpdate(orders.filter((_, i) => i !== index));
    return (
        <div className="ordersPopup">
            <div className="orders">
                { orders.map((order, index) =>
                    <div className="order" key={index}>
                        <span className="attribute">{order.attribute.name}</span>
                        <span className="direction">{order.direction == 1 ? "U" : "N"}</span>
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
                <select className="order_direction" value={direction} onChange={handleDirectionChange}>
                    <option value={1} key={1}>U</option>
                    <option value={-1} key={-1}>N</option>
                </select>
                <button type="button" className="add_order" onClick={handleAddClick}>+</button>
            </div>
        </div>
    );
}
export default OrdersPopup;
