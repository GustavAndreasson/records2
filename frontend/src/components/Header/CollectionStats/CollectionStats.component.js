import React from "react";
import { useTranslation } from "react-i18next";
import "./CollectionStats.scss";

const CollectionStats = ({ collectionStats }) => {
  const { t, i18n } = useTranslation();
  return (collectionStats &&
    <div className="collection-stats">
      <div className="counter">{t("header.collectionstats.counter") + collectionStats.qty}</div>
      <div className="price-sum">{t("header.collectionstats.sum") + collectionStats.sum}</div>
      <div className="price-avg">{t("header.collectionstats.avg") + collectionStats.avg}</div>
    </div>
  )
}

export default CollectionStats;
