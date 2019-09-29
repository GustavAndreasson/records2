import React from "react";
import Record from "./Record";

const Collection = ({ col }) =>
    <div className="collection">
      {col && Object.values(col).map((rec) => <Record rec={rec} handleClick={() => alert(rec.name)} key={rec.id} />)}
    </div>

export default Collection;
