import React, { useState, useEffect } from "react";
import AutoComplete from "react-autocomplete";
import api from "Api";
import "./ArtistInput.scss";

const ArtistInput = ({ handleSetArtist }) => {
    const [artistList, setArtistList] = useState([
        { name: "The Fall",  id: 2228 },
        { name: "The Stooges",  id: 39770 },
        { name: "The Birthday Party",  id: 40247 },
        { name: "The Velvet Underground",  id: 39766 },
        { name: "The Jesus Lizard",  id: 282081 },
    ])
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
        handleSetArtist(artistList.find(artist => artist.name.startsWith(artistName)));
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
