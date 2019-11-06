const compares = {
    sub: {name: "\u2248", key: "sub", func: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0},
    eq: {name: "=", key: "eq", func: (a, b) => a == b},
    neq: {name: "\u2260", key: "neq", func: (a, b) => a != b},
    seq: {name: "=", key: "seq", func: (a, b) => a.toLowerCase() == b.toLowerCase()},
    sneq: {name: "\u2260", key: "sneq", func: (a, b) => a.toLowerCase() != b.toLowerCase()},
    lt: {name: "<", key: "lt", func: (a, b) => a <= b},
    gt: {name: ">", key: "gt", func: (a, b) => a >= b}
};
const attributes = {
    name: {
        name: "Album",
        key: "name",
        compares: ["sub", "seq", "sneq"].map(cmp => compares[cmp]),
        getValues: rec => [rec.name]
    },
    artist: {
        name: "Artist",
        key: "artist",
        compares: ["sub", "seq", "sneq"].map(cmp => compares[cmp]),
        getValues: rec => (
            rec.artists ? rec.artists.map(artist => artist.artist.name) : []
        ).concat(
            rec.artists ? rec.artists.map((artist, index) => artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")).join(" ") : []
        ).concat(
            rec.tracks ? rec.tracks.map(track => track.artists ? track.artists.map(artist => artist.artist.name) : []).flat() : []
        )
    },
    track: {
        name: "Spår",
        key: "track",
        compares: ["sub", "seq"].map(cmp => compares[cmp]),
        getValues: rec => rec.tracks ? rec.tracks.map(track => track.name) : []
    },
    format: {
        name: "Format",
        key: "format",
        compares: ["sub", "seq", "sneq"].map(cmp => compares[cmp]),
        getValues: rec => [rec.format]
    },
    year: {
        name: "År",
        key: "year",
        compares: ["eq", "neq", "lt", "gt"].map(cmp => compares[cmp]),
        getValues: rec => [rec.year]
    },
    price: {
        name: "Pris",
        key: "price",
	    compares: ["gt", "lt", "eq"].map(cmp => compares[cmp]),
        getValues: rec => [parseFloat(rec.price)]
    },
    addedDate: {
        name: "Tillagd",
        key: "addedDate",
        compares: ["eq", "neq", "lt", "gt"].map(cmp => compares[cmp]),
        getValues: rec => [rec.addedDate]
    }
};

export default {
    attributes: attributes,
    compares:  compares,
    getFunction: (attr, cmp, value) => rec => attributes[attr].getValues(rec).some(recVal => compares[cmp].func(recVal, value))
}