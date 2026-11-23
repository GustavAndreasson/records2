import * as qs from "query-string"
import isEqual from "is-equal"
import objectPath from "object-path"

let persistentObjects = []

const getStorageValue = (val, obj) => {
  if (typeof obj.default !== "string" && !obj.ref) {
    return JSON.stringify(val)
  } else if (obj.ref && val) {
    return val.id
  } else {
    return val
  }
}

const Persistent = {
  init(po) {
    persistentObjects = po
  },
  getInitialState(defaultState = {}) {
    const queryString = qs.parse(window.location.search)
    const state = { ...defaultState }
    persistentObjects.forEach(obj => {
      let res = null
      if (obj.qKey) {
        try {
          res = queryString[obj.qKey]
          if (res !== undefined) {
            if (typeof obj.default !== "string") res = JSON.parse(res)
            if (obj.validate) res = obj.validate(res)
          } else {
            res = null
          }
        } catch (e) {
          res = null
          console.log("Malformed persistent value for " + obj.path + " in url")
        }
      }
      if (res === null && obj.lsKey) {
        try {
          res = localStorage.getItem(obj.lsKey)
          if (res !== null) {
            if (typeof obj.default !== "string") res = JSON.parse(res)
            if (obj.validate) res = obj.validate(res)
          }
        } catch (e) {
          res = null
          console.log("Malformed persistent value for " + obj.path + " in local storage")
        }
      } else if (obj.lsKey && res !== null) {
        localStorage.setItem(
          obj.lsKey,
          typeof obj.default !== "string" ? JSON.stringify(res) : res
        )
      }
      if (res === null) res = obj.default
      const finalVal = obj.ref && res !== null ? (typeof res === "object" ? res : { id: res }) : res
      objectPath.set(state, obj.path, finalVal)
    })
    return state
  },
  update(state) {
    const queryString = qs.parse(window.location.search)
    persistentObjects
      .map(obj => {
        let res = null
        if (obj.qKey) {
          try {
            res = queryString[obj.qKey]
            if (res !== undefined) {
              if (typeof obj.default !== "string") res = JSON.parse(res)
              if (obj.validate) res = obj.validate(res)
            } else {
              res = null
            }
          } catch (e) {
            res = null
            console.log("Malformed persistent value for " + obj.path + " in url")
          }
        }
        if (res === null && obj.lsKey) {
          try {
            res = localStorage.getItem(obj.lsKey)
            if (res !== null) {
              if (typeof obj.default !== "string") res = JSON.parse(res)
              if (obj.validate) res = obj.validate(res)
            }
          } catch (e) {
            res = null
            console.log("Malformed persistent value for " + obj.path + " in local storage")
          }
        } else if (obj.lsKey && res !== null) {
          localStorage.setItem(
            obj.lsKey,
            typeof obj.default !== "string" ? JSON.stringify(res) : res
          )
        }
        if (res === null) res = obj.default
        return { path: obj.path, val: obj.ref && res !== null ? (typeof res === "object" ? res : { id: res }) : res }
      })
      .forEach(obj => {
        objectPath.set(state, obj.path, obj.val)
      })
  },
  subscribe(store) {
    if (!store || !store.subscribe) return
    let prevState = store.getState()
    store.subscribe((state) => {
      persistentObjects.forEach(obj => {
        if (obj.lsKey) {
          const val = objectPath.get(state, obj.path)
          const prevVal = objectPath.get(prevState, obj.path)
          if (!isEqual(val, prevVal)) {
            localStorage.setItem(obj.lsKey, getStorageValue(val, obj))
          }
        }
      })
      prevState = state
    })
  },
  query(values) {
    const query = {}
    persistentObjects.forEach(obj => {
      const val = values[obj.path] !== undefined ? values[obj.path] : objectPath.get(values, obj.path)
      if (val !== undefined && val !== null && val !== "" && obj.qKey) {
        if (Array.isArray(val) && val.length === 0) return
        if (typeof val === "boolean" && !val) return
        query[obj.qKey] = getStorageValue(val, obj)
      }
    })
    return window.location.protocol + "//" + window.location.host + "?" + qs.stringify(query)
  },
}

export default Persistent
