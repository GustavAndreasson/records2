import React from "react";
import Record from "./Record";

const Collection = ({ col, handleRecordClick }) =>
    <div className="collection">
        {col && Object.values(col).map((rec) => <Record rec={rec} handleClick={handleRecordClick} key={rec.id} />)}
    </div>

export default Collection;
