import api from "Api"

export const SHOW_POPUP = "SHOW_POPUP"
export const showPopup = popup => ({
  type: SHOW_POPUP,
  popup,
})

export const HIDE_POPUP = "HIDE_POPUP"
export const hidePopup = popup => ({
  type: HIDE_POPUP,
  popup,
})

export const SET_PROGRESS = "SET_PROGRESS"
export const setProgress = progress => ({
  type: SET_PROGRESS,
  progress,
})

export const UPDATE_PROGRESS = "UPDATE_PROGRESS"
export const updateProgress = progress => ({
  type: UPDATE_PROGRESS,
  progress,
})

export const progress = async dispatch => {
  try {
    let progressData = await api.getProgress()
    let progressJSON = await progressData.json()
    dispatch(updateProgress(progressJSON))
  } catch (error) {
    console.error(error)
  }
}

export const SET_GRID_VIEW = "SET_GRID_VIEW"
export const setGridView = gridView => ({
  type: SET_GRID_VIEW,
  gridView,
})

export const SET_GRID_COLUMNS = "SET_GRID_COLUMNS"
export const setGridColumns = gridColumns => ({
  type: SET_GRID_COLUMNS,
  gridColumns,
})
