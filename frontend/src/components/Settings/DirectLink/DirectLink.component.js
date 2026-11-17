import React, { useRef, useMemo } from "react"
import { useAppStore } from "Store"
import { getDirectLink } from "Store/selectors"
import "./DirectLink.scss"

const DirectLink = () => {
  const refInput = useRef()
  const discogsUsername = useAppStore(state => state.discogsUsername)
  const orders = useAppStore(state => state.orders)
  const filters = useAppStore(state => state.filters)
  const activeArtist = useAppStore(state => state.activeArtist)
  const viewArtistCollection = useAppStore(state => state.viewArtistCollection)

  const directLink = useMemo(() => {
    return getDirectLink({
      discogsUsername,
      orders,
      filters,
      activeArtist,
      viewArtistCollection,
    })
  }, [discogsUsername, orders, filters, activeArtist, viewArtistCollection])

  const copyLink = e => {
    e.preventDefault()
    if (refInput.current) {
      refInput.current.select()
      refInput.current.setSelectionRange(0, 99999)
      document.execCommand("copy")
    }
  }

  return (
    <form className="direct-link" onSubmit={copyLink}>
      <input type="text" readOnly ref={refInput} value={directLink} />
      <button type="submit" className="fas fa-copy"></button>
    </form>
  )
}

export default DirectLink
