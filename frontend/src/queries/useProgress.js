import { useQuery } from "@tanstack/react-query"
import api from "Api"

export const fetchProgress = async () => {
  const response = await api.getProgress()
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const useProgressQuery = (enabled = false, options = {}) => {
  return useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
    enabled: Boolean(enabled),
    refetchInterval: (data) => (enabled ? 1000 : false),
    ...options,
  })
}
