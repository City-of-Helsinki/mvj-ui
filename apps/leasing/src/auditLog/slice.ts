import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QueryParams } from "@/types";
import type { AuditLogListMap, AuditLogState } from "./types";
import type { AreaSearchId } from "@/areaSearch/types";
import type { ContactId } from "@/contacts/types";
import type { LeaseId } from "@/leases/types";

export const initialState: AuditLogState = {
  byContact: {},
  byLease: {},
  byAreaSearch: {},
  isFetchingByContact: {},
  isFetchingByLease: {},
  isFetchingByAreaSearch: {},
};

const auditLogSlice = createSlice({
  name: "mvj/auditLog",
  initialState,
  reducers: {
    fetchAuditLogByContact: (
      state,
      { payload }: PayloadAction<QueryParams>,
    ) => {
      state.isFetchingByContact[payload.id] = true;
    },
    receiveAuditLogByContact: (
      state,
      { payload }: PayloadAction<AuditLogListMap>,
    ) => {
      state.byContact = { ...state.byContact, ...payload };
      Object.keys(payload).forEach((key) => {
        state.isFetchingByContact[key] = false;
      });
    },
    notFoundByContact: (state, { payload }: PayloadAction<ContactId>) => {
      state.isFetchingByContact[payload] = false;
    },
    fetchAuditLogByLease: (state, { payload }: PayloadAction<QueryParams>) => {
      state.isFetchingByLease[payload.id] = true;
    },
    receiveAuditLogByLease: (
      state,
      { payload }: PayloadAction<AuditLogListMap>,
    ) => {
      state.byLease = { ...state.byLease, ...payload };
      Object.keys(payload).forEach((key) => {
        state.isFetchingByLease[key] = false;
      });
    },
    notFoundByLease: (state, { payload }: PayloadAction<LeaseId>) => {
      state.isFetchingByLease[payload] = false;
    },
    fetchAuditLogByAreaSearch: (
      state,
      { payload }: PayloadAction<QueryParams>,
    ) => {
      state.isFetchingByAreaSearch[payload.id] = true;
    },
    receiveAuditLogByAreaSearch: (
      state,
      { payload }: PayloadAction<AuditLogListMap>,
    ) => {
      state.byAreaSearch = { ...state.byAreaSearch, ...payload };
      Object.keys(payload).forEach((key) => {
        state.isFetchingByAreaSearch[key] = false;
      });
    },
    notFoundByAreaSearch: (state, { payload }: PayloadAction<AreaSearchId>) => {
      state.isFetchingByAreaSearch[payload] = false;
    },
  },
});

export const {
  fetchAuditLogByContact,
  receiveAuditLogByContact,
  notFoundByContact,
  fetchAuditLogByLease,
  receiveAuditLogByLease,
  notFoundByLease,
  fetchAuditLogByAreaSearch,
  receiveAuditLogByAreaSearch,
  notFoundByAreaSearch,
} = auditLogSlice.actions;

export default auditLogSlice.reducer;
