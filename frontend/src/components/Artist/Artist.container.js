import React from "react"
import { connect } from "react-redux"
import { showArtist } from "Actions"
import Artist from "./Artist.component"

const mapDispatchToProps = dispatch => ({
  handleClick: artist => {
    dispatch(showArtist(artist))
  },
})

export default connect(null, mapDispatchToProps)(Artist)
