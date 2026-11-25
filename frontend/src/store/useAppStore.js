import { create } from "zustand"
import Filter from "Utils/Filter"
import Order from "Utils/Order"
import Persistent from "Utils/Persistent"

Persistent.init([
  { path: "filters", lsKey: "filters", qKey: "f", validate: Filter.validate, default: [] },
  { path: "orders", lsKey: "orders", qKey: "o", validate: Order.validate, default: [] },
  { path: "discogsUsername", lsKey: "discogs_username", qKey: "u", default: "" },
  { path: "currency", lsKey: "currency", default: "SEK" },
  { path: "activeArtist", lsKey: "active_artist", qKey: "a", ref: true, default: null },
  {
    path: "viewArtistCollection",
    lsKey: "view_artist_collection",
    qKey: "va",
    default: false,
  },
  { path: "gridView", lsKey: "grid_view", default: false },
  { path: "gridColumns", lsKey: "grid_columns", default: ["artists", "name"] },
])

const defaultState = {
  // Selections & User
  discogsUsername: "",
  currency: "SEK",
  activeArtist: null,
  activeRecord: null,
  activeListen: null,
  viewArtistCollection: false,

  // Filters & Sorting
  searchQuery: "",
  filters: [],
  orders: [],

  // UI state
  gridView: false,
  gridColumns: ["artists", "name"],
  popups: "",
  recordsLoading: [],
  collectionLoading: false,
  progress: {},
  status: "",
}

const initialPersistedState = Persistent.getInitialState(defaultState)

if (typeof window !== "undefined" && window.history && window.location) {
  window.history.replaceState({}, document.title, window.location.protocol + "//" + window.location.host + window.location.pathname)
}

export const useAppStore = create((set, get) => ({
  ...initialPersistedState,

  // Actions
  setDiscogsUsername: (discogsUsername) => set({ discogsUsername }),
  setCurrency: (currency) => set({ currency }),
  setActiveArtist: (activeArtist) => set({ activeArtist }),
  showArtist: (activeArtist) => set({ activeArtist, activeRecord: null, viewArtistCollection: false }),
  hideArtist: () => set({ activeArtist: null, viewArtistCollection: false }),
  setActiveRecord: (activeRecord) => set({ activeRecord }),
  showRecord: (record) => set({ activeRecord: record?.id ?? record, popups: "recordInfo" }),
  hideRecord: () => set({ activeRecord: null }),
  setActiveListen: (activeListen) => set({ activeListen }),
  showListen: (activeListen) => set({ activeListen, popups: "recordInfo.listen" }),
  setViewArtistCollection: (viewArtistCollection) => set({ viewArtistCollection }),
  toggleViewArtistCollection: () => set((state) => ({ viewArtistCollection: !state.viewArtistCollection })),
  
  // Search & Filter Actions
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) => set({ filters }),
  addFilter: (filter) =>
    set((state) => {
      if (state.filters.some(
        (f) =>
            f.attribute === filter.attribute &&
            f.compare === filter.compare &&
            f.value === filter.value
      )) {
        return { activeRecord: null }
      }
      return {
        filters: [...state.filters, filter],
        activeRecord: null,
      }
    }),
  setOrders: (orders) => set({ orders }),

  // UI Actions
  setGridView: (gridView) => set({ gridView }),
  setGridColumns: (gridColumns) => set({ gridColumns }),
  showPopup: (popups) => set({ popups }),
  hidePopup: (popup) =>
    set((state) => ({
      popups:
        state.popups.indexOf(popup) === 0
          ? popup.substring(0, popup.lastIndexOf("."))
          : state.popups,
    })),
  addRecordLoading: (recordId) =>
    set((state) => ({ recordsLoading: [...state.recordsLoading, recordId] })),
  removeRecordLoading: (recordId) =>
    set((state) => ({
      recordsLoading: state.recordsLoading.filter((id) => id !== recordId),
    })),
  setCollectionLoading: (collectionLoading) => set({ collectionLoading }),
  setProgress: (progress) => set({ progress }),
  updateProgress: (progress) =>
    set((state) => ({ progress: { ...state.progress, ...progress } })),
  setStatus: (status) => set({ status }),
}))

Persistent.subscribe(useAppStore)

export default useAppStore
