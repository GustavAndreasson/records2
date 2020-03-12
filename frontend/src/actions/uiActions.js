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
