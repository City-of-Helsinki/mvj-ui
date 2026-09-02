import { describe, expect, it } from "vitest";
import invoiceSetsReducer, {
  receiveInvoiceSetsByLease,
  fetchInvoiceSetsByLease,
  notFound,
  creditInvoiceSet,
  initialState,
} from "./slice";

describe("Invoice sets", () => {
  describe("Reducer", () => {
    describe("invoiceSetsReducer", () => {
      it("should update invoice sets", () => {
        const leaseId = 1;
        const dummyInvoiceSets = [
          {
            id: 1,
            label: "Foo",
          },
        ];
        const newState = {
          ...initialState,
          byLease: {
            [leaseId]: dummyInvoiceSets,
          },
        };
        const state = invoiceSetsReducer(
          initialState,
          receiveInvoiceSetsByLease({
            leaseId: leaseId,
            invoiceSets: dummyInvoiceSets,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching invoice sets", () => {
        const newState = { ...initialState, isFetching: true };
        const state = invoiceSetsReducer(
          initialState,
          fetchInvoiceSetsByLease(1),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        let state = invoiceSetsReducer(
          initialState,
          fetchInvoiceSetsByLease(1),
        );
        state = invoiceSetsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("creditInvoiceSet should not change state", () => {
        const state = invoiceSetsReducer(initialState, creditInvoiceSet({}));
        expect(state).to.deep.equal(initialState);
      });
    });
  });
});
