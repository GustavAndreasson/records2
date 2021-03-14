import React from "react";
import Header from "Components/Header";
import Collection from "Components/Collection";
import Progress from "Components/Progress";
import RecordInfo from "Components/RecordInfo";
import ArtistInfo from "Components/ArtistInfo";
import UsernameInput from "Components/UsernameInput";
import ArtistInput from "Components/ArtistInput";
import Filters from "Components/Filters";
import Orders from "Components/Orders";
import Settings from "Components/Settings";
import "./App.scss";

const App = ({
    discogsUsername,
    activeArtist,
    viewArtistCollection
}) => (
    <>
        <Header />
        <Filters />
        <Orders />
        <Settings />
        { discogsUsername || (activeArtist && viewArtistCollection) ?
            <>
                <ArtistInfo />
                <Collection />
                <RecordInfo />
                <Progress />
            </>
        :
            <>
                <div className="intro-text">
                    <p>
                        Här kan du titta på din eller andras skivsamlingar. Du kan sortera eller filtrera på flera olika attribut.
                    </p>
                    <p>
                        Skriv in användarnamn från <a href="https://discogs.com">discogs.com</a> i fältet för användarnamn för att hämta en skivsamling (första gången en skivsamling hämtas kan det ta några minuter).
                    </p>
                    <p>
                        Du kan också titta på en artist och vilka skivor den har släppt. Fyll då in artistens namn i fältet för artist (artisten måste finnas i databasen för att den ska komma upp som alternativ).
                    </p>
                </div>
                <UsernameInput />
                <ArtistInput />
            </>
        }
    </>
)

export default App;
