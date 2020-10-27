import React, { useState, useEffect } from "react";
import AutoComplete from "react-autocomplete";
import api from "Api";
import "./ArtistInput.scss";

const ArtistInput = ({ handleSetArtist }) => {
    const [artistList, setArtistList] = useState([])
    const [artistName, setArtistName] = useState("");
    useEffect(() => {
        const getList = async () => {
            try {
                const response = await api.getArtistAutocomplete(artistName);
                const json = await response.json();
                setArtistList(json)
            } catch (error) {
                console.log(error);
            }
        }
        if (artistName.length > 1) {
            getList();
        }
    }, [artistName])
    const handleSubmit = e => {
        e.preventDefault();
        artistList.length && handleSetArtist(artistList[0]);
    }
    return (
        <form className="artist-input" onSubmit={handleSubmit}>
            <AutoComplete
                renderItem={item => (
                    <div key={item.id}>
                        {item.name}
                    </div>)}
                getItemValue={item => item.name}
                items={artistList}
                value={artistName}
                onChange={e => setArtistName(e.target.value)}
                onSelect={val => setArtistName(val)}
            />
            <button type="submit">OK</button>
        </form>
    );
}

export default ArtistInput;
