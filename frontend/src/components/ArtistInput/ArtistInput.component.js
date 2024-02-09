import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import AutoSuggest from "react-autosuggest"
import api from "Api"
import "./ArtistInput.scss"

const ArtistInput = ({ handleSetArtist }) => {
  const { t, i18n } = useTranslation()
  const [artistList, setArtistList] = useState([])
  const [artist, setArtist] = useState(null)
  const [artistName, setArtistName] = useState("")
  const [artistQuery, setArtistQuery] = useState("")
  useEffect(() => {
    const getList = async () => {
      try {
        const response = await api.getArtistAutocomplete(artistQuery, 8)
        const json = await response.json()
        setArtistList(json)
        if (json.length && artistName.length) {
          setArtist(json.find(item => item.name.toLowerCase().startsWith(artistName.toLowerCase())))
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (artistQuery.length > 1) {
      getList()
    }
  }, [artistQuery])
  const handleSubmit = e => {
    e.preventDefault()
    artist && handleSetArtist(artist)
  }
  return (
    <form className="artist-input" onSubmit={handleSubmit}>
      <i className="fas fa-guitar"></i>
      <AutoSuggest
        renderSuggestion={(item, { isHighlighted }) => (
          <div className={isHighlighted ? "highlight" : ""}>
            {item.name +
              (artistList.filter(a => a.name == item.name).length > 1 ? " (" + item.id + ")" : "")}
          </div>
        )}
        getSuggestionValue={item => item.name}
        onSuggestionsFetchRequested={({ value, reason }) =>
          reason == "input-changed" && setArtistQuery(value)
        }
        onSuggestionsClearRequested={() => {
          setArtistList([])
          setArtistQuery("")
        }}
        onSuggestionSelected={(e, { suggestion, suggestionValue }) => {
          setArtistQuery(suggestionValue)
          setArtist(suggestion)
        }}
        suggestions={artistList}
        inputProps={{
          placeholder: t("settings.artist"),
          value: artistName,
          onChange: (e, { newValue }) => {
            setArtistName(newValue || "")
            setArtist(
              newValue
                ? artistList.find(item =>
                    item.name.toLowerCase().startsWith(newValue.toLowerCase())
                  )
                : null
            )
          },
        }}
        highlightFirstSuggestion={true}
        alwaysRenderSuggestions={false}
      />
      <button type="submit" disabled={!artist}>
        {t("common.ok")}
      </button>
    </form>
  )
}

export default ArtistInput
