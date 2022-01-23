import { connect } from "react-redux";
import { showArtist, viewArtistCollection } from "Actions";
import ArtistInput from "./ArtistInput.component";

const mapDispatchToProps = dispatch => ({
  handleSetArtist: artist => {
    dispatch(showArtist(artist))
    dispatch(viewArtistCollection(true))
  }
});

export default connect(null, mapDispatchToProps)(ArtistInput);
