import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type { LeaseId } from "@/leases/types";
import type {
  CollectionCourtDecisionState,
  UploadCollectionCourtDecisionPayload,
  DeleteCollectionCourtDecisionPayload,
  ReceiveCollectionCourtDecisionsByLeasePayload,
} from "./types";

export const initialState: CollectionCourtDecisionState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  isPanelOpen: false,
  isSaveClicked: false,
  methods: null,
};

const collectionCourtDecisionSlice = createSlice({
  name: "mvj/collectionCourtDecision",
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
    fetchCollectionCourtDecisionsByLease: (
      state,
      { payload: lease }: PayloadAction<LeaseId>,
    ) => {
      state.isFetchingByLease[lease] = true;
    },
    receiveCollectionCourtDecisionsByLease: (
      state,
      { payload }: PayloadAction<ReceiveCollectionCourtDecisionsByLeasePayload>,
    ) => {
      state.byLease[payload.lease] = payload.collectionCourtDecisions;
      state.isFetchingByLease[payload.lease] = false;
    },
    notFoundByLease: (state, { payload: lease }: PayloadAction<LeaseId>) => {
      state.isFetchingByLease[lease] = false;
    },
    uploadCollectionCourtDecision: (
      _state,
      _action: PayloadAction<UploadCollectionCourtDecisionPayload>,
    ) => {},
    deleteCollectionCourtDecision: (
      _state,
      _action: PayloadAction<DeleteCollectionCourtDecisionPayload>,
    ) => {},
    hideCollectionCourtDecisionPanel: (state) => {
      state.isPanelOpen = false;
    },
    showCollectionCourtDecisionPanel: (state) => {
      state.isPanelOpen = true;
    },
    receiveIsSaveClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isSaveClicked = payload;
    },
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchCollectionCourtDecisionsByLease,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
  uploadCollectionCourtDecision,
  deleteCollectionCourtDecision,
  hideCollectionCourtDecisionPanel,
  showCollectionCourtDecisionPanel,
  receiveIsSaveClicked,
} = collectionCourtDecisionSlice.actions;

export default collectionCourtDecisionSlice.reducer;
