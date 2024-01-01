import React from "react"
import "./Year.scss"

const Year = ({ value, filterYear }) =>
  value ? (
    <span
      className="year"
      onClick={e => {
        e.stopPropagation()
        filterYear(value)
      }}
    >
      {value}
    </span>
  ) : null

export default Year
