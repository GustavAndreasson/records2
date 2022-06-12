import api from "Api"

export const SET_CURRENCY = "SET_CURRENCY"
export const setCurrency = currency => ({
  type: SET_CURRENCY,
  currency,
})

export const RECEIVE_RATE = "RECEIVE_RATE"
export const receiveRate = json => ({
  type: RECEIVE_RATE,
  rate: json,
})

export const getRate = currency => async (dispatch, getState) => {
  try {
    let response = await api.getRate(currency)
    if (!response.ok) {
      throw Error(response.statusText)
    }
    let json = await response.json()
    dispatch(receiveRate(json))
  } catch (error) {
    console.error(error)
  }
}
