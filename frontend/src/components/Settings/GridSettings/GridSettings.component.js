import React from "react"
import { useTranslation } from "react-i18next"
import Order from "Utils/Order"
import "./GridSettings.scss"

const GridSettings = ({ gridView, gridColumns, setGridView, setGridColumns }) => {
  const { t, i18n } = useTranslation()
  const handleColumnSelect = attribute =>
    setGridColumns(
      Object.keys(Order.attributes).filter(
        attr =>
          (gridColumns.includes(attr) && attr !== attribute) ||
          (!gridColumns.includes(attr) && attr === attribute)
      )
    )
  return (
    <>
      <div className="grid-enable">
        <div className="grid-enable-label">{t("settings.layout")}</div>
        <button
          type="button"
          className={"fas fa-grip-horizontal" + (!gridView ? " selected" : "")}
          onClick={() => setGridView(false)}
          disabled={!gridView}
        ></button>
        <button
          type="button"
          className={"fas fa-list" + (gridView ? " selected" : "")}
          onClick={() => setGridView(true)}
          disabled={gridView}
        ></button>
      </div>
      {gridView && (
        <div className="grid-columns-settings">
          <div className="grid-columns-settings-label">{t("settings.columns")}</div>
          <div className="grid-columns-select">
            {Order.attributes &&
              Object.keys(Order.attributes).map(attribute => (
                <div
                  className={
                    "grid-columns-option" + (gridColumns.includes(attribute) ? " selected" : "")
                  }
                  key={attribute}
                  onClick={() => handleColumnSelect(attribute)}
                >
                  {t("process.attributes." + attribute)}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  )
}

export default GridSettings
