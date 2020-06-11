import * as qs  from "query-string";
import watch from "redux-watch";
import isEqual from "is-equal";
import objectPath from "object-path";

let persistantObjects = [];

export default {
    init(po) {
        persistantObjects = po
    },
    update(state) {
        const queryString = qs.parse(location.search);
        persistantObjects.map(obj => {
            const res = { path: obj.path, val: obj.default}
            try {
                res.val = queryString[obj.qKey] || localStorage.getItem(obj.lsKey);
                if (typeof obj.default === "object") res.val = JSON.parse(res.val);
                if (obj.validate) res.val = obj.validate(res.val);
            } catch (e) {
                res.val = obj.default;
                console.log("Malformed persistant value for " + obj.path);
            }
            return res;
        }).forEach((obj) => {
            objectPath.set(state, obj.path, obj.val)
        });
    },
    subscribe(store) {
        persistantObjects.forEach((obj) => {
            store.subscribe(watch(store.getState, obj.path, isEqual)(val => {
                localStorage.setItem(
                    obj.lsKey,
                    typeof obj.default === "object" ? JSON.stringify(val) : val
                );
            }));
        });
    },
    query(values) {
        const query = {};
        persistantObjects.forEach(obj => {
            if (values[obj.path])
                query[obj.qKey] = typeof obj.default === "object" ? JSON.stringify(values[obj.path]) : values[obj.path];
        });
        return location.protocol + "//" + location.host + "?" + qs.stringify(query);
    }
}
