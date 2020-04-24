const api = {
	getCollection: async discogsUsername => fetch("records/collection/" + discogsUsername),
	updateCollection: async discogsUsername => fetch("records/collection/" + discogsUsername + "/update"),
	getRecord: async recordId => fetch("records/record/" + recordId),
	updateRecord: async recordId => fetch("records/record/" + recordId + "/update"),
	getArtist: async artistId => fetch("records/artist/" + artistId),
	updateArtist: async artistId => fetch("records/artist/" + artistId + "/update"),
	getProgress: async () => fetch("records/progress")
};

export default api;
