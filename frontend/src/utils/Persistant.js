import * as qs  from "query-string";
import watch from "redux-watch";
import isEqual from "is-equal";
import objectPath from "object-path";

let persistantObjects = [];

const getStorageValue = (val, obj) => {
    if (typeof obj.default !== "string" && !obj.ref) {
        return JSON.stringify(val);
    } else if (obj.ref && val) {
        return val.id;
    } else {
        return val;
    }
}


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
                        if (typeof obj.default !== "string") res = JSON.parse(res);
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
                        if (typeof obj.default !== "string") res = JSON.parse(res);
                        if (obj.validate) res = obj.validate(res);
                    }
                } catch (e) {
                    res = null;
                    console.log("Malformed persistant value for " + obj.path + " in local storage");
                }
            } else if (obj.lsKey) {
                localStorage.setItem(
                    obj.lsKey,
                    typeof obj.default !== "string" ? JSON.stringify(res) : res
                );
            }
            if (res === null) res = obj.default;
            return { path: obj.path, val: obj.ref && res !== null ? { id: res } : res };
        }).forEach((obj) => {
            objectPath.set(state, obj.path, obj.val);
        });
    },
    subscribe(store) {
        persistantObjects.forEach((obj) => {
            if (obj.lsKey) {
                store.subscribe(watch(store.getState, obj.path, isEqual)(val => {
                    localStorage.setItem(obj.lsKey, getStorageValue(val, obj));
                }));
            }
        });
    },
    query(values) {
        const query = {};
        persistantObjects.forEach(obj => {
            if (values[obj.path] && obj.qKey) {
                query[obj.qKey] = getStorageValue(values[obj.path], obj);
            }
        });
        return location.protocol + "//" + location.host + "?" + qs.stringify(query);
    }
}
