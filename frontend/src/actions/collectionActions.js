import api from "Api"
import { progress, setProgress, updateProgress } from "./uiActions"

export const REQUEST_COLLECTION = "REQUEST_COLLECTION"
export const requestCollection = () => ({
  type: REQUEST_COLLECTION,
})

export const RECEIVE_COLLECTION = "RECEIVE_COLLECTION"
export const receiveCollection = json => ({
  type: RECEIVE_COLLECTION,
  collection: json,
})

export const FINNISH_RECEIVE_COLLECTION = "FINNISH_RECEIVE_COLLECTION"
export const finnishReceiveCollection = () => ({
  type: FINNISH_RECEIVE_COLLECTION,
})

export const COLLECTION_ERROR = "COLLECTION_ERROR"
export const collectionError = () => ({
  type: COLLECTION_ERROR,
})

export const SET_USERNAME = "SET_USERNAME"
export const setUsername = user => ({
  type: SET_USERNAME,
  user,
})

export const getCollection = user => async (dispatch, getState) => {
  dispatch(requestCollection())
  setTimeout(() => progress(dispatch), 100)
  let progressTimer = setInterval(() => progress(dispatch), 1000)
  try {
    let page = 1
    let json = {}
    dispatch(setProgress({ load: 0 }))
    do {
      let response = await api.getCollection(user, page)
      if (!response.ok) {
        throw Error(response.statusText)
      }
      clearInterval(progressTimer)
      json = await response.json()
      if (getState().collection.discogsUsername !== user) {
        break
      }
      dispatch(
        updateProgress({
          load: Math.round((page * 100) / json.pagination.pagecount),
        })
      )
      dispatch(receiveCollection(json.data))
    } while ((page = json.pagination.nextpage))
    dispatch(finnishReceiveCollection())
  } catch (error) {
    dispatch(collectionError())
    console.error(error)
  } finally {
    clearInterval(progressTimer)
  }
}

export const updateCollection = () => async (dispatch, getState) => {
  dispatch(requestCollection())
  setTimeout(() => progress(dispatch), 100)
  let progressTimer = setInterval(() => progress(dispatch), 1000)
  try {
    const user = getState().collection.discogsUsername
    let response = await api.updateCollection(user)
    if (!response.ok) {
      throw Error(response.statusText)
    }
    let json = await response.json()
    if (getState().collection.discogsUsername === user) {
      dispatch(getCollection(user))
    }
  } catch (error) {
    dispatch(collectionError())
    console.error(error)
  } finally {
    clearInterval(progressTimer)
  }
}
