import React from "react"
import { useAppStore } from "Store"

const FiltersButton = () => {
  const qtyFilters = useAppStore(state => state.filters.length)
  const showPopup = useAppStore(state => state.showPopup)

  return (
    <button type="button" className="fas fa-filter" onClick={() => showPopup("filters")}>
      {qtyFilters > 0 && <span className="button-qty">{qtyFilters}</span>}
    </button>
  )
}

export default FiltersButton
