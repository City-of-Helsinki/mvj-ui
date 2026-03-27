import { describe, expect, it } from "vitest";
import {
  fetchAuditLogByContact,
  receiveAuditLogByContact,
  notFoundByContact,
  fetchAuditLogByLease,
  receiveAuditLogByLease,
  notFoundByLease,
} from "./actions";
import auditLogReducer from "./reducer";
import type { AuditLogState } from "./types";
const defaultState: AuditLogState = {
  byContact: {},
  byLease: {},
  byAreaSearch: {},
  isFetchingByContact: {},
  isFetchingByLease: {},
  isFetchingByAreaSearch: {},
};

describe("AuditLog", () => {
  describe("Reducer", () => {
    describe("auditLogReducer", () => {
      it("should update isFetchingByContact to true when fetching contact auditlog", () => {
        const dummyContactId = 123;
        const newState = {
          ...defaultState,
          isFetchingByContact: {
            [dummyContactId]: true,
          },
        };
        const state = auditLogReducer(
          {},
          fetchAuditLogByContact(dummyContactId),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByContact to false by notFoundByContact", () => {
        const dummyContactId = 123;
        const newState = {
          ...defaultState,
          isFetchingByContact: {
            [dummyContactId]: false,
          },
        };
        let state = auditLogReducer({}, fetchAuditLogByContact(dummyContactId));
        state = auditLogReducer(state, notFoundByContact(dummyContactId));
        expect(state).to.deep.equal(newState);
      });
      it("should update auditLogByContact", () => {
        const dummyContactId = "123";
        const dummyPayload = {
          [dummyContactId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...defaultState,
          byContact: dummyPayload,
          isFetchingByContact: {
            [dummyContactId]: false,
          },
        };
        const state = auditLogReducer(
          {},
          receiveAuditLogByContact(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByLease to true when fetching lease auditlog", () => {
        const dummyLeaseId = "123";
        const newState = {
          ...defaultState,
          isFetchingByLease: {
            [dummyLeaseId]: true,
          },
        };
        const state = auditLogReducer(
          {},
          fetchAuditLogByLease({
            id: dummyLeaseId,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByLease to false by notFoundByLease", () => {
        const dummyLeaseId = 123;
        const newState = {
          ...defaultState,
          isFetchingByLease: {
            [dummyLeaseId]: false,
          },
        };
        let state = auditLogReducer(
          {},
          fetchAuditLogByLease({
            id: dummyLeaseId,
          }),
        );
        state = auditLogReducer(state, notFoundByLease(dummyLeaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update auditLogByLease", () => {
        const dummyLeaseId = "123";
        const dummyPayload = {
          [dummyLeaseId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...defaultState,
          byLease: dummyPayload,
          isFetchingByLease: {
            [dummyLeaseId]: false,
          },
        };
        const state = auditLogReducer({}, receiveAuditLogByLease(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
