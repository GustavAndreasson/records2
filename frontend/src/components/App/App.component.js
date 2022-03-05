import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from 'react-helmet';
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
}) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('app.title')}</title>
      </Helmet>
      <Header />
      <Filters />
      <Orders />
      <Settings />
      {discogsUsername || (activeArtist && viewArtistCollection) ?
        <>
          <ArtistInfo />
          <Collection />
          <RecordInfo />
          <Progress />
        </>
        :
        <>
          <div className="intro-text">
            <p>{t('app.intro')}</p>
            <p>{t('app.startuser1')}<a href="httpd://discogs.com">discogs.com</a>{t('app.startuser2')}</p>
            <p>{t('app.startartist')}</p>
          </div>
          <UsernameInput />
          <ArtistInput />
        </>
      }
    </>
  )
}

export default App;
