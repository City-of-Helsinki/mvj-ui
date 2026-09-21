import { describe, expect, it } from "vitest";
import auditLogReducer, {
  initialState,
  fetchAuditLogByContact,
  receiveAuditLogByContact,
  notFoundByContact,
  fetchAuditLogByLease,
  receiveAuditLogByLease,
  notFoundByLease,
} from "./slice";

describe("AuditLog", () => {
  describe("Reducer", () => {
    describe("auditLogReducer", () => {
      it("should update isFetchingByContact to true when fetching contact auditlog", () => {
        const dummyContactId = 123;
        const newState = {
          ...initialState,
          isFetchingByContact: {
            [dummyContactId]: true,
          },
        };
        const state = auditLogReducer(
          initialState,
          fetchAuditLogByContact({ id: dummyContactId }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByContact to false by notFoundByContact", () => {
        const dummyContactId = 123;
        const newState = {
          ...initialState,
          isFetchingByContact: {
            [dummyContactId]: false,
          },
        };
        let state = auditLogReducer(
          initialState,
          fetchAuditLogByContact({ id: dummyContactId }),
        );
        state = auditLogReducer(state, notFoundByContact(dummyContactId));
        expect(state).to.deep.equal(newState);
      });
      it("should update auditLogByContact", () => {
        const dummyContactId = 123;
        const dummyPayload = {
          [dummyContactId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...initialState,
          byContact: dummyPayload,
          isFetchingByContact: {
            [dummyContactId]: false,
          },
        };
        const state = auditLogReducer(
          initialState,
          receiveAuditLogByContact(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByLease to true when fetching lease auditlog", () => {
        const dummyLeaseId = 123;
        const newState = {
          ...initialState,
          isFetchingByLease: {
            [dummyLeaseId]: true,
          },
        };
        const state = auditLogReducer(
          initialState,
          fetchAuditLogByLease({
            id: dummyLeaseId,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByLease to false by notFoundByLease", () => {
        const dummyLeaseId = 123;
        const newState = {
          ...initialState,
          isFetchingByLease: {
            [dummyLeaseId]: false,
          },
        };
        let state = auditLogReducer(
          initialState,
          fetchAuditLogByLease({
            id: dummyLeaseId,
          }),
        );
        state = auditLogReducer(state, notFoundByLease(dummyLeaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update auditLogByLease", () => {
        const dummyLeaseId = 123;
        const dummyPayload = {
          [dummyLeaseId]: {
            foo: "bar",
          },
        };
        const newState = {
          ...initialState,
          byLease: dummyPayload,
          isFetchingByLease: {
            [dummyLeaseId]: false,
          },
        };
        const state = auditLogReducer(
          initialState,
          receiveAuditLogByLease(dummyPayload),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
