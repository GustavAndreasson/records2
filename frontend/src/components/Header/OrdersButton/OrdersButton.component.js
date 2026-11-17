import React from "react"
import { useAppStore } from "Store"

const OrdersButton = () => {
  const qtyOrders = useAppStore(state => state.orders.length)
  const showPopup = useAppStore(state => state.showPopup)

  return (
    <button type="button" className="fas fa-sort" onClick={() => showPopup("orders")}>
      {qtyOrders > 0 && <span className="button-qty">{qtyOrders}</span>}
    </button>
  )
}

export default OrdersButton
