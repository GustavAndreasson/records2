import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./UsernameInput.scss";

const UsernameInput = ({ discogsUsername, handleUpdateUsername }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(discogsUsername);
  const handleSubmit = e => {
    e.preventDefault();
    handleUpdateUsername(user);
  }
  return (
    <form className="username-input" onSubmit={handleSubmit}>
      <i className="fas fa-user"></i>
      <input type="text" placeholder="Discogs användarnamn" value={user} onChange={e => setUser(e.target.value)} />
      <button type="submit" disabled={!user.length}>{t('common.ok')}</button>
    </form>
  );
}

export default UsernameInput;
