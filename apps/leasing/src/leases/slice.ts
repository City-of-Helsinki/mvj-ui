import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash-es";
import { FormNames } from "@/enums";
import type { Attributes, Methods } from "@/types";
import type {
  Lease,
  CreateLease,
  CreateChargePayload,
  FetchSingleLeaseAfterEditPayload,
  LeaseFormFlags,
  LeaseList,
  SendEmailPayload,
  LeaseId,
  LeaseState,
} from "@/leases/types";

const initialFormDirtyById: LeaseFormFlags = {
  [FormNames.LEASE_BASIS_OF_RENTS]: false,
  [FormNames.LEASE_CONSTRUCTABILITY]: false,
  [FormNames.LEASE_CONTRACTS]: false,
  [FormNames.LEASE_DECISIONS]: false,
  [FormNames.LEASE_INSPECTIONS]: false,
  [FormNames.LEASE_AREAS]: false,
  [FormNames.LEASE_RENTS]: false,
  [FormNames.LEASE_SUMMARY]: false,
  [FormNames.LEASE_TENANTS]: false,
};

export const initialState: LeaseState = {
  attributes: null,
  byId: {},
  collapseStates: {},
  current: {} as Lease,
  isAttachDecisionModalOpen: false,
  isCreateClicked: false,
  isCreateModalOpen: false,
  isEditMode: false,
  isFetching: false,
  isFetchingByBBox: false,
  isFetchingAttributes: false,
  isFetchingById: {},
  isFormDirtyById: initialFormDirtyById,
  isSaveClicked: false,
  isSaving: false,
  list: null,
  listByBBox: null,
  methods: null,
  leasesForContractNumbers: null,
  isFetchingLeasesForContractNumbers: false,
  leasesForContact: null,
  isFetchingLeasesForContact: false,
  leasesForContactAttributes: null,
  isFetchingLeasesForContactAttributes: false,
};

const leaseSlice = createSlice({
  name: "mvj/leases",
  initialState,
  reducers: {
    showAttachDecisionModal: (state) => {
      state.isAttachDecisionModalOpen = true;
    },

    hideAttachDecisionModal: (state) => {
      state.isAttachDecisionModalOpen = false;
    },

    showCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },

    hideCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },

    hideEditMode: (state) => {
      state.isEditMode = false;
    },

    showEditMode: (state) => {
      state.isEditMode = true;
    },

    createLease: (state, _action: PayloadAction<CreateLease>) => {
      state.isFetching = true;
    },

    fetchLeases: (
      state,
      _action: PayloadAction<Record<string, any> | null | undefined>,
    ) => {
      state.isFetching = true;
    },

    fetchSingleLease: (state, _action: PayloadAction<LeaseId>) => {
      state.isFetching = true;
    },

    fetchSingleLeaseAfterEdit: (
      _state,
      _action: PayloadAction<FetchSingleLeaseAfterEditPayload>,
    ) => {},

    receiveLeases: (state, action: PayloadAction<LeaseList>) => {
      state.isFetching = false;
      state.list = action.payload;
    },

    receiveSingleLease: (state, action: PayloadAction<Lease>) => {
      state.isFetching = false;
      state.isSaving = false;
      state.current = action.payload;
    },

    notFound: (state) => {
      state.isFetching = false;
      state.isSaving = false;
      state.isFetchingLeasesForContractNumbers = false;
      state.isFetchingLeasesForContact = false;
    },

    fetchLeasesByBBox: (state, _action: PayloadAction<Record<string, any>>) => {
      state.isFetchingByBBox = true;
    },

    receiveLeasesByBBox: (state, action: PayloadAction<LeaseList>) => {
      state.isFetchingByBBox = false;
      state.listByBBox = action.payload;
    },

    notFoundByBBox: (state) => {
      state.isFetchingByBBox = false;
    },

    deleteLease: (state, _action: PayloadAction<LeaseId>) => {
      state.isSaving = true;
    },

    patchLease: (state, _action: PayloadAction<Lease>) => {
      state.isSaving = true;
    },

    patchLeaseInvoiceNotes: (state, _action: PayloadAction<Partial<Lease>>) => {
      state.isSaving = true;
    },

    startInvoicing: (state, _action: PayloadAction<LeaseId>) => {
      state.isSaving = true;
    },

    stopInvoicing: (state, _action: PayloadAction<LeaseId>) => {
      state.isSaving = true;
    },

    setRentInfoComplete: (state, _action: PayloadAction<LeaseId>) => {
      state.isSaving = true;
    },

    setRentInfoUncomplete: (state, _action: PayloadAction<LeaseId>) => {
      state.isSaving = true;
    },

    copyDecisionToLeases: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isSaving = true;
    },

    sendEmail: (state, _action: PayloadAction<SendEmailPayload>) => {
      state.isSaving = true;
    },

    createCharge: (_state, _action: PayloadAction<CreateChargePayload>) => {},

    fetchLeaseById: (state, action: PayloadAction<LeaseId>) => {
      state.isFetchingById[action.payload] = true;
    },

    receiveLeaseById: (
      state,
      action: PayloadAction<{ leaseId: LeaseId; lease: Lease }>,
    ) => {
      state.isFetchingById[action.payload.leaseId] = false;
      state.byId[action.payload.leaseId] = action.payload.lease;
    },

    notFoundById: (state, action: PayloadAction<LeaseId>) => {
      state.isFetchingById[action.payload] = false;
    },

    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },

    receiveAttributes: (state, action: PayloadAction<Attributes>) => {
      state.attributes = action.payload;
    },

    receiveMethods: (state, action: PayloadAction<Methods>) => {
      state.isFetchingAttributes = false;
      state.methods = action.payload;
    },

    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },

    receiveFormDirtyFlags: (state, action: PayloadAction<LeaseFormFlags>) => {
      state.isFormDirtyById = { ...state.isFormDirtyById, ...action.payload };
    },

    clearFormDirtyFlags: (state) => {
      state.isFormDirtyById = initialFormDirtyById;
    },

    receiveIsSaveClicked: (state, action: PayloadAction<boolean>) => {
      state.isSaveClicked = action.payload;
    },

    receiveIsCreateClicked: (state, action: PayloadAction<boolean>) => {
      state.isCreateClicked = action.payload;
    },

    receiveCollapseStates: (
      state,
      action: PayloadAction<Record<string, any>>,
    ) => {
      state.collapseStates = merge({}, state.collapseStates, action.payload);
    },

    fetchLeasesForContractNumbers: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingLeasesForContractNumbers = true;
    },

    receiveLeasesForContractNumbers: (
      state,
      action: PayloadAction<LeaseList>,
    ) => {
      state.isFetchingLeasesForContractNumbers = false;
      state.leasesForContractNumbers = action.payload;
    },

    fetchLeasesForContact: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingLeasesForContact = true;
    },

    receiveLeasesForContact: (state, action: PayloadAction<LeaseList>) => {
      state.isFetchingLeasesForContact = false;
      state.leasesForContact = action.payload;
    },

    fetchLeasesForContactAttributes: (state) => {
      state.isFetchingLeasesForContactAttributes = true;
    },

    receiveLeasesForContactAttributes: (
      state,
      action: PayloadAction<Attributes>,
    ) => {
      state.isFetchingLeasesForContactAttributes = false;
      state.leasesForContactAttributes = action.payload;
    },

    leasesForContactAttributesNotFound: (state) => {
      state.isFetchingLeasesForContactAttributes = false;
    },
  },
});

export default leaseSlice.reducer;

export const {
  showAttachDecisionModal,
  hideAttachDecisionModal,
  showCreateModal,
  hideCreateModal,
  hideEditMode,
  showEditMode,
  createLease,
  fetchLeases,
  fetchSingleLease,
  fetchSingleLeaseAfterEdit,
  receiveLeases,
  receiveSingleLease,
  notFound,
  fetchLeasesByBBox,
  receiveLeasesByBBox,
  notFoundByBBox,
  deleteLease,
  patchLease,
  patchLeaseInvoiceNotes,
  startInvoicing,
  stopInvoicing,
  setRentInfoComplete,
  setRentInfoUncomplete,
  copyDecisionToLeases,
  sendEmail,
  createCharge,
  fetchLeaseById,
  receiveLeaseById,
  notFoundById,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveFormDirtyFlags,
  clearFormDirtyFlags,
  receiveIsSaveClicked,
  receiveIsCreateClicked,
  receiveCollapseStates,
  fetchLeasesForContractNumbers,
  receiveLeasesForContractNumbers,
  fetchLeasesForContact,
  receiveLeasesForContact,
  fetchLeasesForContactAttributes,
  receiveLeasesForContactAttributes,
  leasesForContactAttributesNotFound,
} = leaseSlice.actions;
