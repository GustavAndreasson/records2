import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import { useCollectionQuery, useArtistCollectionQuery, useRateQuery } from "Queries"
import { filterAndOrderCollection, getCollectionStats } from "Store/selectors"
import "./CollectionStats.scss"

const CollectionStats = () => {
  const { t } = useTranslation()
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)
  const currency = useAppStore(state => state.currency)
  const orders = useAppStore(state => state.orders)
  const filters = useAppStore(state => state.filters)
  const searchQuery = useAppStore(state => state.searchQuery)

  const { data: collection } = useCollectionQuery(discogsUsername)
  const { data: artistCollection } = useArtistCollectionQuery(
    viewArtistCollection && activeArtist ? activeArtist.id : null
  )
  const { data: rate = 1 } = useRateQuery(currency)

  const collectionStats = useMemo(() => {
    const filtered = filterAndOrderCollection({
      collection,
      artistCollection,
      viewArtistCollection,
      rate,
      orders,
      filters,
      activeArtist,
      searchQuery,
    })
    return getCollectionStats(filtered, rate)
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

  return (
    collectionStats && (
      <div className="collection-stats">
        <div className="counter">{t("header.collectionstats.counter") + collectionStats.qty}</div>
        <div className="price-sum">{t("header.collectionstats.sum") + collectionStats.sum}</div>
        <div className="price-avg">{t("header.collectionstats.avg") + collectionStats.avg}</div>
      </div>
    )
  )
}

export default CollectionStats
