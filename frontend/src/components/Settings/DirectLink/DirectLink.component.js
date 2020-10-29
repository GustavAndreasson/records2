import React, { useRef } from "react";
import "./DirectLink.scss";

const DirectLink = ({ directLink }) => {
    const refInput = useRef();
    const copyLink = e => {
        e.preventDefault();
        refInput.current.select();
        refInput.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
    }
    return (
        <form className="direct-link" onSubmit={copyLink}>
            <input type="text" readOnly ref={refInput} value={directLink} />
            <button type="submit" className="fas fa-copy"></button>
        </form>
    );
}

export default DirectLink;
