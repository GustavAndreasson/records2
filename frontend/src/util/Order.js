const attributes = {
    year: {
        name: "År",
        key: "year",
        getValue: rec => rec.year
    },
    artist: {
        name: "Artist",
        key: "artist",
        getValue: rec =>
            rec.artists.map((artist, index) =>
                artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")
            ).join(" ")
    },
    name: {
        name: "Album",
        key: "name",
        getValue: rec => rec.name
    },
    price: {
        name: "Pris",
        key: "price",
        getValue: rec => rec.price == null ? 0 : parseFloat(rec.price)
    },
    addedDate: {
        name: "Tillagd",
        key: "addedDate",
        getValue: rec => rec.addedDate
    }
};

export default {
    attributes : attributes,
    run: ({ attribute, reverse }) => col => col.sort(
        (recA, recB) => (reverse ? -1 : 1) * (
            attributes[attribute].getValue(recA) > attributes[attribute].getValue(recB)
            ? 1
            : (attributes[attribute].getValue(recA) < attributes[attribute].getValue(recB) ? -1 : 0)
        )
    )
}
