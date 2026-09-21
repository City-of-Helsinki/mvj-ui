import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BillingPeriodState,
  FetchBillingPeriodsPayload,
  ReceiveBillingPeriodsPayload,
} from "./types";

export const initialState: BillingPeriodState = {
  byLease: {},
  isFetching: false,
};

const billingPeriodSlice = createSlice({
  name: "mvj/billingperiods",
  initialState,
  reducers: {
    fetchBillingPeriodsByLease: (
      state,
      _action: PayloadAction<FetchBillingPeriodsPayload>,
    ) => {
      state.isFetching = true;
    },
    receiveBillingPeriodsByLease: (
      state,
      { payload }: PayloadAction<ReceiveBillingPeriodsPayload>,
    ) => {
      state.byLease[payload.leaseId] = payload.billingPeriods;
      state.isFetching = false;
    },
    notFound: (state) => {
      state.isFetching = false;
    },
  },
});

export const {
  fetchBillingPeriodsByLease,
  receiveBillingPeriodsByLease,
  notFound,
} = billingPeriodSlice.actions;

export default billingPeriodSlice.reducer;
