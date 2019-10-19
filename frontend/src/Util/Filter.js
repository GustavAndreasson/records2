export default {
    attributes: [
        {name: "Album",  key: "name"},
        {name: "Artist",  key: "artist"},
        {name: "Format",  key: "format"},
        {name: "År",  key: "year"}
    ],
    compares: {
        eq: {name: "=", key: "eq", func: (a, b) => a == b},
        neq: {name: "!=", key: "neq", func: (a, b) => a != b},
        sub: {name: "~", key: "sub", func: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) >= 0},
        lt: {name: "&lt;", key: "lt", func: (a, b) => a <= b},
        gt: {name: "&gt;", key: "gt", func: (a, b) => a >= b}
    }
}
