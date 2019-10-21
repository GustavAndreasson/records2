export default {
    attributes : {
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
        addedDate: {
            name: "Tillagd",
            key: "addedDate",
            getValue: rec => rec.addedDate
        }
    },
    getFunction: (attr, dir) => col => col.sort(
        (recA, recB) => dir * (
            attr.getValue(recA) > attr.getValue(recB) ? 1 : (attr.getValue(recA) < attr.getValue(recB) ? -1 : 0)
        )
    )
}
