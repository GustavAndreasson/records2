import React from "react"
import { useAppStore } from "Store"
import Popup from "Components/Popup"
import "./Listen.scss"

const Listen = () => {
  const listen = useAppStore(state => state.activeListen)

  return (
    listen && (
      <Popup
        name="recordInfo.listen"
        icon={{ image: listen.icon }}
        title={listen.name || listen.type}
      >
        <div className="listen" dangerouslySetInnerHTML={{ __html: listen.html }}></div>
      </Popup>
    )
  )
}

export default Listen
