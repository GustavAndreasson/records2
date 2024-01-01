import React from "react"

const Price = ({ value, rate }) => <>{value && (value * rate).toFixed(2)}</>

export default Price
