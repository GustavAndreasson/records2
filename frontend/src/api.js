const api = {
	getCollection: async discogsUsername => fetch("records/collection/" + discogsUsername),
	updateCollection: async discogsUsername => fetch("records/collection/" + discogsUsername + "/update"),
	getRecord: async recordId => fetch("records/record/" + recordId),
	updateRecord: async recordId => fetch("records/record/" + recordId + "/update"),
	getArtist: async artistId => fetch("records/artist/" + artistId),
	getArtistReleases: async artistId => fetch("records/artist/" + artistId + "/releases"),
	updateArtist: async artistId => fetch("records/artist/" + artistId + "/update"),
	updateArtistReleases: async artistId => fetch("records/artist/" + artistId + "/releases/update"),
	getArtistAutocomplete: async artistStart => fetch("records/artist/autocomplete?q=" + artistStart),
	getProgress: async () => fetch("records/progress")
};

export default api;
