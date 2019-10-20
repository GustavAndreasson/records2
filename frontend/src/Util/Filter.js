const attributes = {
    name: {name: "Album",  key: "name", compares: ["sub", "eq", "neq"]},
    artist: {name: "Artist",  key: "artist", compares: ["sub", "eq", "neq"]},
    format: {name: "Format",  key: "format", compares: ["sub", "eq", "neq"]},
    year: {name: "År",  key: "year", compares: ["eq", "neq", "lt", "gt"]}
};
const compares = {
    sub: {name: "~", key: "sub", func: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0},
    eq: {name: "=", key: "eq", func: (a, b) => a == b},
    neq: {name: "!=", key: "neq", func: (a, b) => a != b},
    lt: {name: "<", key: "lt", func: (a, b) => a <= b},
    gt: {name: ">", key: "gt", func: (a, b) => a >= b}
};

export default {
    attributes: attributes,
    compares: compares,
    getFunction: (attr, cmp, value) => rec => compares[cmp].func(rec[attr], value)
}
