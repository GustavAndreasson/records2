import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "Api"

export const fetchCollection = async (username, onProgress) => {
  if (!username) return null
  let page = 1
  let json = {}
  let collection = {}
  if (onProgress) onProgress(0)

  do {
    const response = await api.getCollection(username, page)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    json = await response.json()
    if (json.data) {
      collection = { ...collection, ...json.data }
    }
    if (onProgress && json.pagination?.pagecount) {
      onProgress(Math.round((page * 100) / json.pagination.pagecount))
    }
  } while ((page = json.pagination?.nextpage))

  return collection
}

export const useCollectionQuery = (username, options = {}) => {
  return useQuery({
    queryKey: ["collection", username],
    queryFn: () => fetchCollection(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useUpdateCollectionMutation = (username) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user = username) => {
      const response = await api.updateCollection(user)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    },
    onSuccess: (_, user) => {
      queryClient.invalidateQueries(["collection", user || username])
    },
  })
}
