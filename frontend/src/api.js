export default const api = {
	getCollection: discogsUsername => fetch("records/collection/" + discogsUsername + "/get/2"),
	updateCollection: discogsUsername => fetch("records/collection/" + discogsUsername + "/update"),
	getRecord: recordId => fetch("records/record/" + recordId + "/get"),
	updateRecord: recordId => fetch("records/record/" + recordId + "/update"),
	getArtist: artistId => fetch("records/artist/" + artistId + "/get"),
	updateArtist: artistId => fetch("records/artist/" + getState().activeArtist.id + "/update")
}