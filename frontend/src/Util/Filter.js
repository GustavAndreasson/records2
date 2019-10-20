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
        getValue: rec => rec.name
    },
    artist: {
        name: "Artist",
        key: "artist",
        compares: Object.values(compares).filter(cmp => ["sub", "eq", "neq"].includes(cmp.key)),
        getValue: rec => rec.artists.map((artist, index) => artist.artist.name + (index < rec.artists.length - 1 ? " " + artist.delimiter : "")).join(" ")
    },
    format: {
        name: "Format",
        key: "format",
        compares: Object.values(compares).filter(cmp => ["sub", "eq", "neq"].includes(cmp.key)),
        getValue: rec => rec.format
    },
    year: {
        name: "År",
        key: "year",
        compares: Object.values(compares).filter(cmp => ["eq", "neq", "lt", "gt"].includes(cmp.key)),
        getValue: rec => rec.year
    }
};

export default {
    attributes: attributes,
    getFunction: (attr, cmp, value) => rec => compares[cmp].func(attributes[attr].getValue(rec), value)
}
