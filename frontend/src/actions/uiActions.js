import api from "Api";

export const SHOW_POPUP = "SHOW_POPUP";
export const showPopup = popup => ({
    type: SHOW_POPUP,
    popup
})

export const HIDE_POPUP = "HIDE_POPUP";
export const hidePopup = popup => ({
    type: HIDE_POPUP,
    popup
})

export const UPDATE_PROGRESS = "UPDATE_PROGRESS";
export const updateProgress = progress => ({
    type: UPDATE_PROGRESS,
    progress
})

export const progress = async (dispatch) => {
    try {
        let progressData = await api.getProgress();
        let progressJSON = await progressData.json();
        dispatch(updateProgress(progressJSON));
    } catch (error) {
        dispatch(updateProgress({}));
        console.error(error);
    }
}
