import { createSelector } from "reselect";
import * as qs  from "query-string";
import FilterUtil from "./util/Filter";
import OrderUtil from "./util/Order";

export const selectOrderedFilteredCollection = createSelector(
    state => state.collection,
    state => state.orders,
    state => state.filters,
    state => state.activeArtist,
    state => state.searchQuery,
    (collection, orders, filters, activeArtist, searchQuery) => {
        let filterRecord = (rec) => (
            (
                !activeArtist ||
                rec.artists.map(artist => artist.artist.id).includes(activeArtist.id) ||
                (rec.tracks &&
                    rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(activeArtist.id))) ||
                (activeArtist.members &&
                    activeArtist.members.some(member =>
                        rec.artists.map(artist => artist.artist.id).includes(member.artist.id) ||
                        (rec.tracks &&
                            rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(member.artist.id))))) ||
                (activeArtist.groups &&
                    activeArtist.groups.some(group =>
                        rec.artists.map(artist => artist.artist.id).includes(group.artist.id) ||
                        (rec.tracks &&
                            rec.tracks.some(track => track.artists && track.artists.map(artist => artist.artist.id).includes(group.artist.id)))))
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
            .reduceRight((col, order) => OrderUtil.run(order)(col), Object.values(collection))
            .reduce((col, rec) =>
                filterRecord(rec) ? col.concat(rec) : col,
                []
            );
    }
);

export const selectActiveRecord = createSelector(
    state => state.collection,
    state => state.activeRecord,
    (collection, activeRecord) => activeRecord && collection[activeRecord]
);

export const selectCollectionStats = createSelector(
    selectOrderedFilteredCollection,
    (orderedFilteredCollection) => {
        let priceSum = orderedFilteredCollection.reduce((sum, rec) => sum + (rec.price ? parseFloat(rec.price) : 0), 0);
		return {
			qty: orderedFilteredCollection.length,
			sum: priceSum.toFixed(2),
			avg: (priceSum / orderedFilteredCollection.filter(rec => rec.price).length).toFixed(2)
		};
	}
);

export const selectDirectLink = createSelector(
    state => state.discogsUsername,
    state => state.orders,
    state => state.filters,
    state => state.activeArtist,
    (discogsUsername, orders, filters, activeArtist) => {
        const query = {
            user: discogsUsername,
            artist: activeArtist,
            filters: JSON.stringify(filters),
            orders: JSON.stringify(orders)
        }
        return location.protocol + "//" + location.host + "?" + qs.stringify(query);
    }
);
