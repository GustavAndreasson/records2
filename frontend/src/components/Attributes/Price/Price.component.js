import React from "react"
import { useAppStore } from "Store"
import { useRateQuery } from "Queries"

const Price = ({ value }) => {
  const currency = useAppStore(state => state.currency)
  const { data: rate = 1 } = useRateQuery(currency)

  return <>{value && (value * rate).toFixed(2)}</>
}

export default Price
