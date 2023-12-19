import React from "react"
import { useTranslation } from "react-i18next"
import "./GridHeader.scss"

const GridHeader = ({ gridView, gridColumns, currency, orders, switchOrder }) => {
  const { t, i18n } = useTranslation()
  return (
    /*gridView &&*/ <div className="grid-header">
      <div className="column-title"></div>
      {gridColumns &&
        gridColumns.map(column => (
          <div className="column-title" key={column} onClick={() => switchOrder(column)}>
            {t("process.attributes." + column)}
            {column == "price" && " (" + currency + ")"}
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
