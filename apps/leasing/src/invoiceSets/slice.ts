import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LeaseId } from "@/leases/types";
import type { InvoiceSetState } from "./types";

export const initialState: InvoiceSetState = {
  byLease: {},
  isFetching: false,
};

const invoiceSetSlice = createSlice({
  name: "mvj/invoiceSets",
  initialState,
  reducers: {
    fetchInvoiceSetsByLease: (state, _action: PayloadAction<LeaseId>) => {
      state.isFetching = true;
    },

    receiveInvoiceSetsByLease: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.byLease = {
        ...state.byLease,
        [payload.leaseId]: payload.invoiceSets,
      };
      state.isFetching = false;
    },

    creditInvoiceSet: (
      _state,
      _action: PayloadAction<Record<string, any>>,
    ) => {},

    notFound: (state) => {
      state.isFetching = false;
    },
  },
});

export const {
  fetchInvoiceSetsByLease,
  receiveInvoiceSetsByLease,
  creditInvoiceSet,
  notFound,
} = invoiceSetSlice.actions;

export default invoiceSetSlice.reducer;
