import React from "react";
import Record from "./Record";

const Collection = ({ col }) =>
    Object.keys(col).length > 0 ? (
        <div class="collection">
            Object.values(col).map(rec => <Record record={rec} />);
        </div>
    );
export default Collection;
