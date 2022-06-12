import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Popup from "Components/Popup"
import Order from "Utils/Order"
import "./Orders.scss"

const Orders = ({ orders, handleUpdate }) => {
  const { t, i18n } = useTranslation()
  const [attribute, setAttribute] = useState(Object.values(Order.attributes)[0].key)
  const [reverse, setReverse] = useState(false)
  const handleAttributeChange = event => setAttribute(Order.attributes[event.target.value].key)
  const handleReverseChange = event => setReverse(event.target.checked)
  const handleAddClick = e => {
    e.preventDefault()
    handleUpdate(
      orders.concat({
        attribute: attribute,
        reverse: reverse,
      })
    )
    setReverse(false)
  }
  const handleRemoveClick = index => handleUpdate(orders.filter((_, i) => i !== index))
  return (
    <Popup name="orders" icon={{ icon: "fas fa-sort" }} title={t("process.sort")}>
      <div className="orders">
        <div className="current-orders">
          {orders.map((order, index) => (
            <div className="order" key={index}>
              <span className="attribute">{t("process.attributes." + order.attribute)}</span>
              <i className={"direction fas " + (order.reverse ? "fa-sort-up" : "fa-sort-down")}></i>
              <button
                type="button"
                className="remove-order fas fa-minus"
                onClick={() => handleRemoveClick(index)}
              ></button>
            </div>
          ))}
        </div>
        <form className="new-order" onSubmit={handleAddClick}>
          <select className="order-attribute" value={attribute} onChange={handleAttributeChange}>
            {Object.values(Order.attributes).map(
              attr =>
                attr.key !== "id" && (
                  <option value={attr.key} key={attr.key}>
                    {t("process.attributes." + attr.key)}
                  </option>
                )
            )}
          </select>
          <input
            type="checkbox"
            className="order-reverse"
            id="order-reverse"
            checked={reverse}
            onChange={handleReverseChange}
          />
          <label htmlFor="order-reverse" className="button fas"></label>
          <button type="submit" className="add-order fas fa-plus"></button>
        </form>
      </div>
    </Popup>
  )
}

export default Orders
