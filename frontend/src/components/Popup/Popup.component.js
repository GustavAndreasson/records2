import React from "react"
import { useAppStore } from "Store"
import "./Popup.scss"

const Popup = ({
  children,
  name,
  icon,
  title,
  scrolling = false,
  loading = false,
  hide,
}) => {
  const popups = useAppStore(state => state.popups)
  const hidePopup = useAppStore(state => state.hidePopup)

  const handleClose = () => {
    if (hide) hide()
    hidePopup(name)
  }

  return (
    popups.indexOf(name) === 0 && (
      <div className={"popup " + "level" + name.split(".").length + (scrolling ? " scrolling" : "")}>
        <div className="popup-header">
          {loading && (
            <div className="loader">
              <div className="bar"></div>
            </div>
          )}
          {icon &&
            (icon.image ? (
              <div className="popup-icon">
                <img src={icon.image} alt={title || ""} />
              </div>
            ) : (
              icon.icon && <div className={"popup-icon " + icon.icon}></div>
            ))}
          {title && <div className="popup-title">{title}</div>}
          <div className="close-button fas fa-times" onClick={handleClose}></div>
        </div>
        <div className="content">{children}</div>
      </div>
    )
  )
}

export default Popup
