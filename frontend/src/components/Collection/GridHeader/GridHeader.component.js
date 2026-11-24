import React from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import "./GridHeader.scss"

const GridHeader = () => {
  const { t } = useTranslation()
  const gridColumns = useAppStore(state => state.gridColumns)
  const currency = useAppStore(state => state.currency)
  const orders = useAppStore(state => state.orders)
  const setOrders = useAppStore(state => state.setOrders)

  const switchOrder = order => {
    if (orders.some(o => o.attribute === order)) {
      const existing = orders.find(o => o.attribute === order)
      if (existing.reverse) {
        setOrders(orders.filter(o => o.attribute !== order))
      } else {
        setOrders(
          orders.map(o =>
            o.attribute === order ? { attribute: order, reverse: true } : o
          )
        )
      }
    } else {
      setOrders([...orders, { attribute: order, reverse: false }])
    }
  }

  return (
    <div className="grid-header">
      <div className="column-title"></div>
      {gridColumns &&
        gridColumns.map(column => (
          <div className="column-title" key={column} onClick={() => switchOrder(column)}>
            {t("process.attributes." + column)}
            {column === "price" && " (" + currency + ")"}
            {orders.some(o => o.attribute === column) && (
              <i
                className={
                  "direction fas " +
                  (orders.find(o => o.attribute === column).reverse ? "fa-sort-up" : "fa-sort-down")
                }
              ></i>
            )}
          </div>
        ))}
    </div>
  )
}

export default GridHeader
