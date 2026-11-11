import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type { LeaseId } from "@/leases/types";
import type {
  CollectionLetterState,
  DeleteCollectionLetterPayload,
  UploadCollectionLetterPayload,
} from "@/collectionLetter/types";

export const initialState: CollectionLetterState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  methods: null,
};

const collectionLetterSlice = createSlice({
  name: "mvj/collectionLetter",
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
    fetchCollectionLettersByLease: (
      state,
      { payload }: PayloadAction<LeaseId>,
    ) => {
      state.isFetchingByLease[payload] = true;
    },
    receiveCollectionLettersByLease: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingByLease[payload.lease] = false;
      state.byLease[payload.lease] = payload.collectionLetters;
    },
    notFoundByLease: (state, { payload }: PayloadAction<LeaseId>) => {
      state.isFetchingByLease[payload] = false;
    },
    uploadCollectionLetter: (
      _state,
      _action: PayloadAction<UploadCollectionLetterPayload>,
    ) => {},
    deleteCollectionLetter: (
      _state,
      _action: PayloadAction<DeleteCollectionLetterPayload>,
    ) => {},
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCollectionLettersByLease,
  receiveCollectionLettersByLease,
  notFoundByLease,
  uploadCollectionLetter,
  deleteCollectionLetter,
} = collectionLetterSlice.actions;

export default collectionLetterSlice.reducer;
