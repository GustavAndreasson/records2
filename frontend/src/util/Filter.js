const compares = {
    sub: {name: "~", key: "sub", func: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0},
    eq: {name: "=", key: "eq", func: (a, b) => a == b},
    neq: {name: "!=", key: "neq", func: (a, b) => a != b},
    lt: {name: "<", key: "lt", func: (a, b) => a <= b},
    gt: {name: ">", key: "gt", func: (a, b) => a >= b}
};
const attributes = {
    name: {
        name: "Album",
        key: "name",
        compares: Object.values(compares).filter(cmp => ["sub", "eq", "neq"].includes(cmp.key)),
        getValues: rec => [rec.name]
    },
    artist: {
        name: "Artist",
        key: "artist",
        compares: Object.values(compares).filter(cmp => ["sub", "eq", "neq"].includes(cmp.key)),
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
        compares: Object.values(compares).filter(cmp => ["sub", "eq"].includes(cmp.key)),
        getValues: rec => rec.tracks ? rec.tracks.map(track => track.name) : []
    },
    format: {
        name: "Format",
        key: "format",
        compares: Object.values(compares).filter(cmp => ["sub", "eq", "neq"].includes(cmp.key)),
        getValues: rec => [rec.format]
    },
    year: {
        name: "År",
        key: "year",
        compares: Object.values(compares).filter(cmp => ["eq", "neq", "lt", "gt"].includes(cmp.key)),
        getValues: rec => [rec.year]
    },
    addedDate: {
        name: "Tillagd",
        key: "addedDate",
        compares: Object.values(compares).filter(cmp => ["eq", "neq", "lt", "gt"].includes(cmp.key)),
        getValues: rec => [rec.addedDate]
    }
};

export default {
    attributes: attributes,
    compares:  compares,
    getFunction: (attr, cmp, value) => rec => attr.getValues(rec).some(recVal => cmp.func(recVal, value))
}
