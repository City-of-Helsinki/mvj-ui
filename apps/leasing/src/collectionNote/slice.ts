import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type { LeaseId } from "@/leases/types";
import type {
  CollectionNotePayload,
  CollectionNoteState,
  DeleteCollectionNotePayload,
} from "./types";

export const initialState: CollectionNoteState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  methods: null,
};

const collectionNoteSlice = createSlice({
  name: "mvj/collectionNote",
  initialState,
  reducers: {
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
      state.isFetchingAttributes = false;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    fetchCollectionNotesByLease: (
      state,
      { payload }: PayloadAction<LeaseId>,
    ) => {
      state.isFetchingByLease[payload] = true;
    },
    receiveCollectionNotesByLease: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingByLease[payload.lease] = false;
      state.byLease[payload.lease] = payload.collectionNotes;
    },
    notFoundByLease: (state, { payload }: PayloadAction<LeaseId>) => {
      state.isFetchingByLease[payload] = false;
    },
    createCollectionNote: (
      _state,
      _action: PayloadAction<CollectionNotePayload>,
    ) => {},
    deleteCollectionNote: (
      _state,
      _action: PayloadAction<DeleteCollectionNotePayload>,
    ) => {},
    editCollectionNote: (
      _state,
      _action: PayloadAction<CollectionNotePayload>,
    ) => {},
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCollectionNotesByLease,
  receiveCollectionNotesByLease,
  notFoundByLease,
  createCollectionNote,
  deleteCollectionNote,
  editCollectionNote,
} = collectionNoteSlice.actions;

export default collectionNoteSlice.reducer;
