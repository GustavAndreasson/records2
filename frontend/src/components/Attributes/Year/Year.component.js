import React from "react"
import { useAppStore } from "Store"
import "./Year.scss"

const Year = ({ value }) => {
  const addFilter = useAppStore(state => state.addFilter)

  return value ? (
    <span
      className="year"
      onClick={e => {
        e.stopPropagation()
        addFilter({ attribute: "year", compare: "eq", value: value })
      }}
    >
      {value}
    </span>
  ) : null
}

export default Year
