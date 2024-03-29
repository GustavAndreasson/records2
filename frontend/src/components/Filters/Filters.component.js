import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Popup from "Components/Popup"
import FilterValue from "./FilterValue"
import Filter from "Utils/Filter"
import "./Filters.scss"

const Filters = ({ filters, handleUpdate }) => {
  const { t, i18n } = useTranslation()
  const [attribute, setAttribute] = useState(Object.values(Filter.attributes)[0].key)
  const [compare, setCompare] = useState(Object.values(Filter.attributes)[0].compares[0].key)
  const [value, setValue] = useState("")
  const handleAttributeChange = event => {
    setAttribute(event.target.value)
    setCompare(Filter.attributes[event.target.value].compares[0].key)
  }
  const handleCompareChange = event => setCompare(event.target.value)
  const handleValueChange = val => setValue(val)
  const handleAddClick = e => {
    e.preventDefault()
    handleUpdate(
      filters.concat({
        attribute: attribute,
        compare: compare,
        value: value,
      })
    )
    setValue("")
  }
  const handleRemoveClick = index => handleUpdate(filters.filter((_, i) => i !== index))
  return (
    <Popup name="filters" icon={{ icon: "fas fa-filter" }} title={t("process.filter")}>
      <div className="filters">
        <div className="current-filters">
          {filters.map((filter, index) => (
            <div className="filter" key={index}>
              <span className="attribute">{t("process.attributes." + filter.attribute)}</span>
              <span className="compare">{Filter.compares[filter.compare].name}</span>
              <span className="value">{filter.value}</span>
              <button
                type="button"
                className="remove-filter fas fa-minus"
                onClick={() => handleRemoveClick(index)}
              ></button>
            </div>
          ))}
        </div>
        <form className="new-filter" onSubmit={handleAddClick}>
          <select className="filter-attribute" value={attribute} onChange={handleAttributeChange}>
            {Object.values(Filter.attributes).map(attr => (
              <option value={attr.key} key={attr.key}>
                {t("process.attributes." + attr.key)}
              </option>
            ))}
          </select>
          <select className="filter-compare" value={compare} onChange={handleCompareChange}>
            {Filter.attributes[attribute].compares.map(cmp => (
              <option value={cmp.key} key={cmp.key}>
                {cmp.name}
              </option>
            ))}
          </select>
          <FilterValue
            attribute={attribute}
            compare={compare}
            value={value}
            handleValueChange={handleValueChange}
          />
          <button type="submit" className="add-filter fas fa-plus"></button>
        </form>
      </div>
    </Popup>
  )
}

export default Filters
