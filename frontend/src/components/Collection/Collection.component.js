import React, { useEffect, useMemo } from "react"
import { forceCheck } from "react-lazyload"
import { useAppStore } from "Store"
import { useCollectionQuery, useArtistCollectionQuery, useRateQuery } from "Queries"
import { filterAndOrderCollection } from "Store/selectors"
import Record from "./Record"
import GridHeader from "./GridHeader"
import "./Collection.scss"

const Collection = () => {
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const gridView = useAppStore(state => state.gridView)
  const currency = useAppStore(state => state.currency)
  const orders = useAppStore(state => state.orders)
  const filters = useAppStore(state => state.filters)
  const searchQuery = useAppStore(state => state.searchQuery)

  const { data: collection } = useCollectionQuery(discogsUsername)
  const { data: artistCollection } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )
  const { data: rate = 1 } = useRateQuery(currency)

  const orderedFilteredCollection = useMemo(() => {
    return filterAndOrderCollection({
      collection,
      artistCollection,
      viewArtistCollection,
      rate,
      orders,
      filters,
      activeArtist,
      searchQuery,
    })
  }, [
    collection,
    artistCollection,
    viewArtistCollection,
    rate,
    orders,
    filters,
    activeArtist,
    searchQuery,
  ])

  useEffect(() => {
    forceCheck()
  }, [orderedFilteredCollection])

  return (
    orderedFilteredCollection && (
      <div className={"collection" + (gridView ? " grid-view" : "")}>
        {gridView && <GridHeader />}
        {orderedFilteredCollection.map(rec => (
          <Record rec={rec} key={rec.id} />
        ))}
      </div>
    )
  )
}

export default Collection
