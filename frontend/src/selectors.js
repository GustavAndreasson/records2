import { createSelector } from "reselect";
import FilterUtil from "Utils/Filter";
import OrderUtil from "Utils/Order";
import Persistant from "Utils/Persistant";

export const selectCollection = createSelector(
    state => state.collection.collection,
    state => state.artist.artistCollection,
    state => state.artist.viewArtistCollection,
    (collection, artistCollection, viewArtistCollection) => Object.values(viewArtistCollection ? artistCollection : collection)
);

export const selectOrderedFilteredCollection = createSelector(
    state => state.collection.collection,
    state => state.process.orders,
    state => state.process.filters,
    state => state.artist.activeArtist,
    state => state.artist.artistCollection,
    state => state.artist.viewArtistCollection,
    state => state.process.searchQuery,
    (collection, orders, filters, activeArtist, artistCollection, viewArtistCollection, searchQuery) => {
        if ((viewArtistCollection && !artistCollection) || (!viewArtistCollection && !collection)) {
            return null;
        }
        let filterRecord = (rec) => (
            (
                !activeArtist || viewArtistCollection ||
                rec.artists.map(artist => artist.artist.id).includes(activeArtist.id) ||
                (rec.tracks &&
                    rec.tracks.some(track => track.artists &&
                        track.artists.map(artist => artist.artist.id).includes(activeArtist.id))) ||
                (activeArtist.members &&
                    activeArtist.members.some(member =>
                        rec.artists.map(artist => artist.artist.id).includes(member.artist.id) ||
                        (rec.tracks &&
                            rec.tracks.some(track => track.artists &&
                                track.artists.map(artist => artist.artist.id).includes(member.artist.id))))) ||
                (activeArtist.groups &&
                    activeArtist.groups.some(group =>
                        rec.artists.map(artist => artist.artist.id).includes(group.artist.id) ||
                        (rec.tracks &&
                            rec.tracks.some(track => track.artists &&
                                track.artists.map(artist => artist.artist.id).includes(group.artist.id)))))
            ) &&
            (
                searchQuery === "" ||
                rec.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
                rec.artists.map(artist => artist.artist.name).join().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
            ) &&
            (
                !filters ||
                filters.every(filter => FilterUtil.run(filter)(rec))
            )
        );
        return orders
            .concat({ attribute: "id", reverse: false })
            .reduceRight(
                (col, order) => OrderUtil.run(order)(col),
                Object.values(viewArtistCollection ? artistCollection : collection)
            ).reduce((col, rec) =>
                filterRecord(rec) ? col.concat(rec) : col,
                []
            );
    }
);

export const selectActiveRecord = createSelector(
    state => state.collection.collection,
    state => state.artist.artistCollection,
    state => state.artist.viewArtistCollection,
    state => state.collection.activeRecord,
    (collection, artistCollection, viewArtistCollection, activeRecord) =>
        activeRecord &&
            (viewArtistCollection
                ? activeRecord in artistCollection && artistCollection[activeRecord]
                : activeRecord in collection && collection[activeRecord])
);

export const selectCollectionStats = createSelector(
    selectOrderedFilteredCollection,
    (orderedFilteredCollection) => {
        if (!orderedFilteredCollection) {
            return null;
        }
        let priceSum = orderedFilteredCollection.reduce((sum, rec) => sum + (rec.price ? parseFloat(rec.price) : 0), 0);
		return {
			qty: orderedFilteredCollection.length,
			sum: priceSum.toFixed(2),
			avg: (priceSum / orderedFilteredCollection.filter(rec => rec.price).length).toFixed(2)
		};
	}
);

export const selectDirectLink = createSelector(
    state => state.collection.discogsUsername,
    state => state.process.orders,
    state => state.process.filters,
    state => state.artist.activeArtist,
    state => state.artist.viewArtistCollection,
    (discogsUsername, orders, filters, activeArtist, viewArtistCollection) => Persistant.query({
        "collection.discogsUsername": discogsUsername,
        "process.orders": orders,
        "process.filters": filters,
        "artist.activeArtist": activeArtist,
        "artist.viewArtistCollection": viewArtistCollection
    })
);
