const api = {
	getCollection: async (discogsUsername, page) => fetch("records/collection/" + discogsUsername + "?pagesize=30&page=" + page),
	updateCollection: async discogsUsername => fetch("records/collection/" + discogsUsername + "/update"),
	getRecord: async recordId => fetch("records/record/" + recordId),
	updateRecord: async recordId => fetch("records/record/" + recordId + "/update"),
	getArtist: async artistId => fetch("records/artist/" + artistId),
	getArtistReleases: async (artistId, page) => fetch("records/artist/" + artistId + "/releases?pagesize=30&page=" + page),
	updateArtist: async artistId => fetch("records/artist/" + artistId + "/update"),
	updateArtistReleases: async artistId => fetch("records/artist/" + artistId + "/releases/update"),
	getArtistAutocomplete: async (artistStart, length) => fetch("records/artist/autocomplete?q=" + encodeURIComponent(artistStart) + "&l=" + length),
	getProgress: async () => fetch("records/progress"),
	getRate: async currency => fetch("records/rate/" + currency)
};

export default api;
