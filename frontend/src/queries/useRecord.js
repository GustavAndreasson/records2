import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "Api"

export const fetchRecord = async (recordId) => {
  if (!recordId) return null
  const response = await api.getRecord(recordId)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const useRecordQuery = (recordId, options = {}) => {
  return useQuery({
    queryKey: ["record", recordId],
    queryFn: () => fetchRecord(recordId),
    enabled: Boolean(recordId),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useRecordMutation = (recordId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id = recordId) => {
      const response = await api.updateRecord(id)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    },
    onSuccess: (updatedRecord, id) => {
      const targetId = id || recordId
      queryClient.setQueryData(["record", targetId], updatedRecord)

      // Update in collection queries if present
      queryClient.setQueriesData({ queryKey: ["collection"] }, (oldCollection) => {
        if (!oldCollection || !oldCollection[targetId]) return oldCollection
        return {
          ...oldCollection,
          [targetId]: {
            ...updatedRecord,
            addedDate: oldCollection[targetId].addedDate,
          },
        }
      })

      // Update in artist collection queries if present
      queryClient.setQueriesData({ queryKey: ["artistCollection"] }, (oldArtistCollection) => {
        if (!oldArtistCollection || !oldArtistCollection[targetId]) return oldArtistCollection
        return {
          ...oldArtistCollection,
          [targetId]: updatedRecord,
        }
      })
    },
  })
}
