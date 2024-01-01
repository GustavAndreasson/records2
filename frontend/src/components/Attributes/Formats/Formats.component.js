import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"
import "./Formats.scss"

const Formats = ({ value, filterFormat }) => {
  const { t, i18n } = useTranslation()
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
                filterFormat(format)
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
