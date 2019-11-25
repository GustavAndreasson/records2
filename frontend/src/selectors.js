import { createSelector } from 'reselect';
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
                searchQuery == "" ||
                rec.name.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
                rec.artists.map(artist => artist.artist.name).join().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
            ) &&
            (
                !filters ||
                filters.every(filter => FilterUtil.run(filter)(rec))
            )
        );
        let orderedFilteredCollection = orders
            .reduceRight((col, order) => OrderUtil.run(order)(col), Object.values(collection))
            .reduce((col, rec) =>
                filterRecord(rec) ? col.concat(rec) : col,
                []
            );
        /*let prices = orderedFilteredCollection.reduce((prcs, recId) =>
            collection[recId].price ? prcs.concat(collection[recId].price) : prcs,
            []
        );
        let priceSum = prices.reduce((sum, price) => sum + parseFloat(price),  0);*/
        return orderedFilteredCollection;
    }
);