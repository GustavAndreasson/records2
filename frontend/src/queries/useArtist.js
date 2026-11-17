import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "Api"

export const fetchArtist = async (artistId) => {
  if (!artistId) return null
  const response = await api.getArtist(artistId)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const fetchArtistReleases = async (artistId, onProgress) => {
  if (!artistId) return null
  let page = 1
  let json = {}
  let collection = {}
  if (onProgress) onProgress(0)

  do {
    const response = await api.getArtistReleases(artistId, page)
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

export const useArtistQuery = (artistId, options = {}) => {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => fetchArtist(artistId),
    enabled: Boolean(artistId),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useArtistCollectionQuery = (artistId, options = {}) => {
  return useQuery({
    queryKey: ["artistCollection", artistId],
    queryFn: () => fetchArtistReleases(artistId),
    enabled: Boolean(artistId),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useUpdateArtistMutation = (artistId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id = artistId) => {
      const response = await api.updateArtist(id)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(["artist", id || artistId], data)
    },
  })
}

export const useUpdateArtistCollectionMutation = (artistId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id = artistId) => {
      const response = await api.updateArtistReleases(id)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["artistCollection", id || artistId])
    },
  })
}
