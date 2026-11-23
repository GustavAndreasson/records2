import FilterUtil from "Utils/Filter"
import OrderUtil from "Utils/Order"
import Persistent from "Utils/Persistent"

export const filterAndOrderCollection = ({
  collection,
  artistCollection,
  viewArtistCollection = false,
  rate = 1,
  orders = [],
  filters = [],
  activeArtist = null,
  searchQuery = "",
}) => {
  const currentCollection = viewArtistCollection ? artistCollection : collection
  if (!currentCollection) {
    return null
  }
  const records = Object.values(currentCollection)
  const filterRecord = (rec) =>
    (!activeArtist ||
      viewArtistCollection ||
      (rec.artists && rec.artists.map((artist) => artist.artist.id).includes(activeArtist.id)) ||
      (rec.tracks &&
        rec.tracks.some(
          (track) =>
            track.artists &&
            track.artists.map((artist) => artist.artist.id).includes(activeArtist.id)
        )) ||
      (activeArtist.members &&
        activeArtist.members.some(
          (member) =>
            (rec.artists && rec.artists.map((artist) => artist.artist.id).includes(member.artist.id)) ||
            (rec.tracks &&
              rec.tracks.some(
                (track) =>
                  track.artists &&
                  track.artists.map((artist) => artist.artist.id).includes(member.artist.id)
              ))
        )) ||
      (activeArtist.groups &&
        activeArtist.groups.some(
          (group) =>
            (rec.artists && rec.artists.map((artist) => artist.artist.id).includes(group.artist.id)) ||
            (rec.tracks &&
              rec.tracks.some(
                (track) =>
                  track.artists &&
                  track.artists.map((artist) => artist.artist.id).includes(group.artist.id)
              ))
        ))) &&
    (searchQuery === "" ||
      (rec.name && rec.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) ||
      (rec.artists &&
        rec.artists
          .map((artist) => artist.artist.name)
          .join()
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) >= 0)) &&
    (!filters ||
      filters.every((filter) =>
        FilterUtil.run(filter)({ ...rec, price: rec.price && rate && rec.price * rate })
      ))

  return (orders || [])
    .concat({ attribute: "id", reverse: false })
    .reduceRight(
      (col, order) => OrderUtil.run(order)(col),
      records
    )
    .reduce((col, rec) => (filterRecord(rec) ? col.concat(rec) : col), [])
}

export const getCollectionStats = (orderedFilteredCollection, rate) => {
  if (!orderedFilteredCollection || !rate) {
    return null
  }
  const priceSum =
    rate *
    orderedFilteredCollection.reduce(
      (sum, rec) => sum + (rec.price ? parseFloat(rec.price) : 0),
      0
    )
  const pricedRecords = orderedFilteredCollection.filter((rec) => rec.price)
  return {
    qty: orderedFilteredCollection.length,
    sum: priceSum.toFixed(2),
    avg: pricedRecords.length > 0 ? (priceSum / pricedRecords.length).toFixed(2) : "0.00",
  }
}

export const getDirectLink = ({
  discogsUsername,
  orders,
  filters,
  activeArtist,
  viewArtistCollection,
}) => {
  return Persistent.query({
    discogsUsername,
    orders,
    filters,
    activeArtist,
    viewArtistCollection,
  })
}

export const getActiveRecord = (collection, artistCollection, viewArtistCollection, activeRecordId) => {
  if (!activeRecordId) return null
  const col = viewArtistCollection ? artistCollection : collection
  return col && activeRecordId in col ? col[activeRecordId] : null
}
