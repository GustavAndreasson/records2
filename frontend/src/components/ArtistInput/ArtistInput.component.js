import React, { useState, useEffect } from "react";
import AutoSuggest from "react-autosuggest";
import api from "Api";
import "./ArtistInput.scss";

const ArtistInput = ({ handleSetArtist }) => {
    const [artistList, setArtistList] = useState([]);
    const [artist, setArtist] = useState(null);
    const [artistName, setArtistName] = useState("");
    const [artistQuery, setArtistQuery] = useState("");
    useEffect(() => {
        const getList = async () => {
            try {
                const response = await api.getArtistAutocomplete(artistQuery, 8);
                const json = await response.json();
                setArtistList(json);
                if (json.length && artistName.length) {
                    setArtist(json.find(item => item.name.toLowerCase().startsWith(artistName.toLowerCase())));
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (artistQuery.length > 1) {
            getList();
        }
    }, [artistQuery])
    const handleSubmit = e => {
        e.preventDefault();
        artist && handleSetArtist(artist);
    }
    return (
        <form className="artist-input" onSubmit={handleSubmit}>
            <i className="fas fa-guitar"></i>
            <AutoSuggest
                renderSuggestion={(item, {isHighlighted}) => (
                    <div className={isHighlighted ? "highlight" : ""}>
                        {item.name}
                    </div>)}
                getSuggestionValue={item => item.name}
                onSuggestionsFetchRequested={({value, reason}) => reason == 'input-changed' && setArtistQuery(value)}
                onSuggestionsClearRequested={() => {
                    setArtistList([]);
                    setArtistQuery("");
                }}
                onSuggestionSelected={(e, {suggestionValue}) => setArtistQuery(suggestionValue)}
                suggestions={artistList}
                inputProps={{
                    placeholder: 'Artist',
                    value: artistName,
                    onChange: (e, {newValue}) => {
                        setArtistName(newValue || "");
                        setArtist(newValue ? artistList.find(item => item.name.toLowerCase().startsWith(newValue.toLowerCase())) : null);
                    }
                }}
                highlightFirstSuggestion={true}
                alwaysRenderSuggestions={false}
            />
            <button type="submit" disabled={!artist}>OK</button>
        </form>
    );
}

export default ArtistInput;
