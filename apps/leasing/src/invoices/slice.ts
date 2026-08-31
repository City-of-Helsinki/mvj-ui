import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type {
  Invoice,
  InvoiceListMap,
  ExportInvoiceToLaskeAndUpdateListPayload,
  InvoiceState,
} from "./types";
import type { LeaseId } from "@/leases/types";

export const initialState: InvoiceState = {
  attributes: null,
  byLease: {},
  invoiceToCredit: null,
  isCreateClicked: false,
  isCreatePanelOpen: false,
  isCreditClicked: false,
  isCreditPanelOpen: false,
  isEditClicked: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaving: false,
  methods: null,
  patchedInvoice: null,
};

const invoiceSlice = createSlice({
  name: "mvj/invoices",
  initialState,
  reducers: {
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    fetchInvoicesByLease: (state, _action: PayloadAction<LeaseId>) => {
      state.isFetching = true;
    },
    receiveInvoicesByLease: (
      state,
      { payload }: PayloadAction<InvoiceListMap>,
    ) => {
      state.byLease = { ...state.byLease, [payload.leaseId]: payload.invoices };
      state.isFetching = false;
      state.isSaving = false;
    },
    createInvoice: (state, _action: PayloadAction<Invoice>) => {
      state.isFetching = true;
    },
    creditInvoice: (_state, _action: PayloadAction<Record<string, any>>) => {},
    patchInvoice: (state, _action: PayloadAction<Invoice>) => {
      state.isSaving = true;
    },
    deleteInvoice: (state, _action: PayloadAction<Invoice>) => {
      state.isSaving = true;
    },
    exportInvoiceToLaskeAndUpdateList: (
      state,
      _action: PayloadAction<ExportInvoiceToLaskeAndUpdateListPayload>,
    ) => {
      state.isSaving = true;
    },
    receivePatchedInvoice: (state, { payload }: PayloadAction<Invoice>) => {
      state.patchedInvoice = payload;
    },
    clearPatchedInvoice: (state) => {
      state.patchedInvoice = null;
    },
    receiveIsCreateInvoicePanelOpen: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isCreatePanelOpen = payload;
    },
    receiveIsCreditInvoicePanelOpen: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.isCreditPanelOpen = payload;
    },
    receiveIsCreateClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreateClicked = payload;
    },
    receiveIsCreditClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isCreditClicked = payload;
    },
    receiveIsEditClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditClicked = payload;
    },
    receiveInvoiceToCredit: (
      state,
      { payload }: PayloadAction<Invoice | null | undefined>,
    ) => {
      state.invoiceToCredit = payload;
    },
    notFound: (state) => {
      state.isFetching = false;
      state.isSaving = false;
    },
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchInvoicesByLease,
  receiveInvoicesByLease,
  createInvoice,
  creditInvoice,
  patchInvoice,
  deleteInvoice,
  exportInvoiceToLaskeAndUpdateList,
  receivePatchedInvoice,
  clearPatchedInvoice,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  receiveIsCreateClicked,
  receiveIsCreditClicked,
  receiveIsEditClicked,
  receiveInvoiceToCredit,
  notFound,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
