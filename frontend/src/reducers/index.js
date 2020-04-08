import { combineReducers } from "redux";
import collection from "./collectionReducer";
import artist from "./artistReducer";
import process from "./processReducer";
import ui from "./uiReducer";

export default combineReducers({
    collection,
    artist,
    process,
    ui
});
