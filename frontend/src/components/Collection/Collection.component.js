import React, { useEffect } from "react"
import { forceCheck } from "react-lazyload"
import Record from "./Record"
import GridHeader from "./GridHeader"
import "./Collection.scss"

const Collection = ({ collection, collectionId, gridView, rate, loadCollection, loadRate }) => {
  useEffect(() => {
    if (!collection) {
      loadCollection()
    }
    if (!rate) {
      loadRate()
    }
  }, [collectionId])

  useEffect(() => {
    forceCheck()
  }, [collection])

  return (
    collection && (
      <div className={"collection" + (gridView && " grid-view")}>
        {gridView && <GridHeader />}
        {collection.map(rec => (
          <Record rec={rec} key={rec.id} />
        ))}
      </div>
    )
  )
}

export default Collection
