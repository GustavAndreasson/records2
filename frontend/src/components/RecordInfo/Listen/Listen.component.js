import React from "react"
import Popup from "Components/Popup"
import "./Listen.scss"

const Listen = ({ listen }) =>
  listen && (
    <Popup
      name="recordInfo.listen"
      icon={{ image: listen.icon }}
      title={listen.name || listen.type}
    >
      <div className="listen" dangerouslySetInnerHTML={{ __html: listen.html }}></div>
    </Popup>
  )

export default Listen
