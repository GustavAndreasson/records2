import React, { Fragment } from "react"
import "./Genres.scss"

const Genres = ({ value, filterGenre }) =>
  value
    ? value.map((genre, index) => (
        <Fragment key={index}>
          {(index && ", ") || null}
          <span
            className="genre"
            onClick={e => {
              e.stopPropagation()
              filterGenre(genre)
            }}
            key={index}
          >
            {genre}
          </span>
        </Fragment>
      ))
    : null

export default Genres
