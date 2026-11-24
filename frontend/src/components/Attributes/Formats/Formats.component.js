import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "Store"
import "./Formats.scss"

const Formats = ({ value }) => {
  const { t } = useTranslation()
  const addFilter = useAppStore(state => state.addFilter)

  return value
    ? value
        .filter(format => format.name !== "All-Media")
        .map((format, index) => (
          <Fragment key={index}>
            {(index && ", ") || null}
            <span
              className="format"
              onClick={e => {
                e.stopPropagation()
                addFilter({ attribute: "formats", compare: "seq", value: format.name })
              }}
              key={index}
            >
              {(format.qty > 1 ? format.qty + "x" : "") + t("format." + format.name, format.name)}
            </span>
          </Fragment>
        ))
    : null
}

export default Formats
