import { useQuery } from "@tanstack/react-query"
import api from "Api"

export const fetchRate = async (currency) => {
  if (!currency) return 0
  const response = await api.getRate(currency)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json = await response.json()
  return json.rate || 0
}

export const useRateQuery = (currency, options = {}) => {
  return useQuery({
    queryKey: ["rate", currency],
    queryFn: () => fetchRate(currency),
    enabled: Boolean(currency),
    staleTime: 60 * 60 * 1000, // 1 hour for exchange rates
    ...options,
  })
}
