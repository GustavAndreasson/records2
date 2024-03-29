const attributes = {
  artists: {
    name: "Artist",
    key: "artists",
    getValue: rec =>
      rec.artists
        .map(
          (artist, index) =>
            artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
        )
        .join(" "),
  },
  name: {
    name: "Album",
    key: "name",
    getValue: rec => rec.name,
  },
  year: {
    name: "År",
    key: "year",
    getValue: rec => rec.year,
  },
  formats: {
    name: "Format",
    key: "formats",
    getValue: rec => rec.formats && rec.formats.map(f => f.name).join(" "),
  },
  genres: {
    name: "Genres",
    key: "genres",
    getValue: rec => rec.genres && rec.genres.join(" "),
  },
  price: {
    name: "Pris",
    key: "price",
    getValue: rec => (rec.price == null ? 0 : parseFloat(rec.price)),
  },
  addedDate: {
    name: "Tillagd",
    key: "addedDate",
    getValue: rec => rec.addedDate,
  },
  id: {
    name: "ID",
    key: "id",
    getValue: rec => rec.id,
  },
}

export default {
  attributes: attributes,
  run:
    ({ attribute, reverse }) =>
    col =>
      col.sort(
        (recA, recB) =>
          (reverse ? -1 : 1) *
          (attributes[attribute].getValue(recA) > attributes[attribute].getValue(recB)
            ? 1
            : attributes[attribute].getValue(recA) < attributes[attribute].getValue(recB)
            ? -1
            : 0)
      ),
  validate: orders => {
    if (
      orders.every(
        o => o.attribute && Object.keys(attributes).includes(o.attribute) && o.reverse !== undefined
      )
    ) {
      return orders
    } else {
      throw "Order syntax error"
    }
  },
}
