const compares = {
  sub: {
    name: "\u2248",
    key: "sub",
    func: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0,
  },
  eq: { name: "=", key: "eq", func: (a, b) => a == b },
  neq: { name: "\u2260", key: "neq", func: (a, b) => a != b },
  seq: { name: "=", key: "seq", func: (a, b) => a.toLowerCase() == b.toLowerCase() },
  sneq: { name: "\u2260", key: "sneq", func: (a, b) => a.toLowerCase() != b.toLowerCase() },
  lt: { name: "<", key: "lt", func: (a, b) => a <= b },
  gt: { name: ">", key: "gt", func: (a, b) => a >= b },
}
const attributes = {
  name: {
    name: "Album",
    key: "name",
    type: "text",
    compares: ["seq", "sub", "sneq"].map(cmp => compares[cmp]),
    getValues: rec => [rec.name],
  },
  artist: {
    name: "Artist",
    key: "artist",
    type: "text",
    compares: ["seq", "sub", "sneq"].map(cmp => compares[cmp]),
    getValues: rec =>
      (rec.artists ? rec.artists.map(artist => artist.artist.name) : [])
        .concat(
          rec.artists
            ? rec.artists
                .map(
                  (artist, index) =>
                    artist.artist.name +
                    (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
                )
                .join(" ")
            : []
        )
        .concat(
          rec.tracks
            ? rec.tracks
                .map(track =>
                  track.artists ? track.artists.map(artist => artist.artist.name) : []
                )
                .flat()
            : []
        ),
  },
  track: {
    name: "Spår",
    key: "track",
    type: "text",
    compares: ["seq", "sub"].map(cmp => compares[cmp]),
    getValues: rec => (rec.tracks ? rec.tracks.map(track => track.name) : []),
  },
  format: {
    name: "Format",
    key: "format",
    type: "text",
    compares: ["seq", "sub", "sneq"].map(cmp => compares[cmp]),
    getValues: rec => (rec.format ? rec.format.split(" ") : [""]),
  },
  genres: {
    name: "Genre",
    key: "genres",
    type: "text",
    compares: ["seq", "sub", "sneq"].map(cmp => compares[cmp]),
    getValues: rec => rec.genres || [],
  },
  year: {
    name: "År",
    key: "year",
    type: "number",
    compares: ["gt", "lt", "eq", "neq"].map(cmp => compares[cmp]),
    getValues: rec => [rec.year],
  },
  price: {
    name: "Pris",
    key: "price",
    type: "number",
    compares: ["gt", "lt", "eq"].map(cmp => compares[cmp]),
    getValues: rec => [parseFloat(rec.price)],
  },
  addedDate: {
    name: "Tillagd",
    key: "addedDate",
    type: "date",
    compares: ["gt", "lt", "eq", "neq"].map(cmp => compares[cmp]),
    getValues: rec => [rec.addedDate],
  },
}

export default {
  attributes: attributes,
  compares: compares,
  run:
    ({ attribute, compare, value }) =>
    rec =>
      compare == "sneq" || compare == "neq"
        ? attributes[attribute]
            .getValues(rec)
            .every(recVal => compares[compare].func(recVal, value))
        : attributes[attribute]
            .getValues(rec)
            .some(recVal => compares[compare].func(recVal, value)),
  validate: filters => {
    if (
      filters.every(
        f =>
          f.attribute &&
          Object.keys(attributes).includes(f.attribute) &&
          f.compare &&
          attributes[f.attribute].compares.some(c => c.key === f.compare) &&
          f.value !== undefined
      )
    ) {
      return filters
    } else {
      throw "Filter syntax error"
    }
  },
}
