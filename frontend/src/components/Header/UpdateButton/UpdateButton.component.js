import React from "react"

const UpdateButton = ({ handleUpdate, collectionLoading }) => (
  <button
    type="button"
    className="fas fa-sync"
    disabled={collectionLoading}
    onClick={handleUpdate}
  ></button>
)

export default UpdateButton
