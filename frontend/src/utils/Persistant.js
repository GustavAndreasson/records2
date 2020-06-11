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
            let res = null;
            if (obj.qKey) {
                try {
                    res = queryString[obj.qKey];
                    if (res !== undefined) {
                        if (typeof obj.default === "object") res = JSON.parse(res);
                        if (obj.validate) res = obj.validate(res);
                    } else {
                        res = null;
                    }
                } catch (e) {
                    res = null;
                    console.log("Malformed persistant value for " + obj.path + " in url");
                }
            }
            if (res === null && obj.lsKey) {
                try {
                    res = localStorage.getItem(obj.lsKey)
                    if (res !== null) {
                        if (typeof obj.default === "object") res = JSON.parse(res);
                        if (obj.validate) res = obj.validate(res);
                    }
                } catch (e) {
                    res = null;
                    console.log("Malformed persistant value for " + obj.path + " in local storage");
                }
            } else if (obj.lsKey) {
                localStorage.setItem(
                    obj.lsKey,
                    typeof obj.default === "object" ? JSON.stringify(res) : res
                );
            }
            if (res === null) res = obj.default;
            return { path: obj.path, val: res };
        }).forEach((obj) => {
            objectPath.set(state, obj.path, obj.val);
        });
    },
    subscribe(store) {
        persistantObjects.forEach((obj) => {
            if (obj.lsKey) {
                store.subscribe(watch(store.getState, obj.path, isEqual)(val => {
                    localStorage.setItem(
                        obj.lsKey,
                        typeof obj.default === "object" ? JSON.stringify(val) : val
                    );
                }));
            }
        });
    },
    query(values) {
        const query = {};
        persistantObjects.forEach(obj => {
            if (values[obj.path] && obj.qKey) {
                query[obj.qKey] = typeof obj.default === "object" ? JSON.stringify(values[obj.path]) : values[obj.path];
            }
        });
        return location.protocol + "//" + location.host + "?" + qs.stringify(query);
    }
}
