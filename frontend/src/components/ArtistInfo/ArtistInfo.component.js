import React, { Fragment, useEffect } from "react"
import { useAppStore } from "Store"
import { useArtistQuery, useUpdateArtistMutation } from "Queries"
import Artist from "Components/Artist"
import Description from "./Description"
import { fixArtistName } from "Utils/Helpers"
import "./ArtistInfo.scss"

const ArtistInfo = () => {
  const activeArtist = useAppStore(state => state.activeArtist)
  const hideArtist = useAppStore(state => state.hideArtist)

  const { data: fetchedArtist } = useArtistQuery(activeArtist?.id)
  const updateArtistMutation = useUpdateArtistMutation(activeArtist?.id)

  const artist = fetchedArtist || activeArtist

  useEffect(() => {
    if (artist && artist.id) {
      if (artist.updated) {
        let threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        if (artist.updated < threeMonthsAgo.toISOString()) {
          updateArtistMutation.mutate(artist.id)
        }
      }
    }
  }, [artist?.id, artist?.updated])

  return (
    artist && (
      <div className="artist-info">
        {artist.name && <div className="name">{fixArtistName(artist.name)}</div>}
        {artist.image && <img src={artist.image} alt={artist.name} />}
        {artist.description && <Description description={artist.description} />}
        {artist.members && (
          <div className="members">
            {artist.members.map((member, index) => (
              <Fragment key={member.artist.id}>
                {index > 0 && ", "}
                <Artist artist={member.artist} active={member.active} />
              </Fragment>
            ))}
          </div>
        )}
        {artist.groups && (
          <div className="groups">
            {artist.groups.map((group, index) => (
              <Fragment key={group.artist.id}>
                {index > 0 && ", "}
                <Artist artist={group.artist} active={group.active} />
              </Fragment>
            ))}
          </div>
        )}
        <div className="artist-buttons">
          <button type="button" className="fas fa-times" onClick={hideArtist}></button>
        </div>
      </div>
    )
  )
}

export default ArtistInfo
