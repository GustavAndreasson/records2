import React from "react"
import { useAppStore } from "Store"
import {
  useCollectionQuery,
  useArtistCollectionQuery,
  useUpdateCollectionMutation,
  useUpdateArtistCollectionMutation,
  useRecordMutation,
} from "Queries"

const UpdateButton = () => {
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const activeRecordId = useAppStore(state => state.activeRecord)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)

  const { isFetching: isCollectionFetching } = useCollectionQuery(discogsUsername)
  const { isFetching: isArtistFetching } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )

  const updateCollectionMutation = useUpdateCollectionMutation(discogsUsername)
  const updateArtistCollectionMutation = useUpdateArtistCollectionMutation(activeArtist?.id)
  const updateRecordMutation = useRecordMutation(activeRecordId)

  const collectionLoading = viewArtistCollection ? isArtistFetching : isCollectionFetching

  const handleUpdate = async () => {
    if (activeRecordId) {
      await updateRecordMutation.mutateAsync(activeRecordId)
    } else if (viewArtistCollection && activeArtist) {
      await updateArtistCollectionMutation.mutateAsync(activeArtist.id)
    } else if (discogsUsername) {
      await updateCollectionMutation.mutateAsync(discogsUsername)
    }
  }

  const isUpdating =
    updateCollectionMutation.isLoading ||
    updateArtistCollectionMutation.isLoading ||
    updateRecordMutation.isLoading

  return (
    <button
      type="button"
      className="fas fa-sync"
      disabled={collectionLoading || isUpdating}
      onClick={handleUpdate}
    ></button>
  )
}

export default UpdateButton
