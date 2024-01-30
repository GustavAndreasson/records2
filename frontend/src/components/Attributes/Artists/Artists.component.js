import React, { Fragment } from "react"
import Artist from "Components/Artist"

const Artists = ({ value }) =>
  value &&
  value.map((artist, index) => (
    <Fragment key={artist.artist.id}>
      <Artist artist={artist.artist} anv={artist.anv} />
      {index < value.length - 1 && " " + artist.delimiter + " "}
    </Fragment>
  ))
export default Artists
