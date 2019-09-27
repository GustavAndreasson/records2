import React from "react";
import Record from "./Record";

const Collection = ({ col }) =>
    <div class="collection">
      {col && Object.values(col).map((rec) => <Record record={rec, () => alert(rec.name)} />)};
    </div>

export default Collection;
