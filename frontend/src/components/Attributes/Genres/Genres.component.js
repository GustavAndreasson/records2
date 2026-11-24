import React, { Fragment } from "react"
import { useAppStore } from "Store"
import "./Genres.scss"

const Genres = ({ value }) => {
  const addFilter = useAppStore(state => state.addFilter)

  return value
    ? value.map((genre, index) => (
        <Fragment key={index}>
          {(index && ", ") || null}
          <span
            className="genre"
            onClick={e => {
              e.stopPropagation()
              addFilter({ attribute: "genres", compare: "seq", value: genre })
            }}
            key={index}
          >
            {genre}
          </span>
        </Fragment>
      ))
    : null
}

export default Genres
