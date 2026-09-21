import { describe, expect, it } from "vitest";
import billingPeriodsReducer, {
  initialState,
  receiveBillingPeriodsByLease,
  fetchBillingPeriodsByLease,
  notFound,
} from "./slice";
import type { BillingPeriodList } from "./types";

describe("Billing periods", () => {
  describe("Reducer", () => {
    describe("billingPeriodsReducer", () => {
      it("should update billing periods", () => {
        const leaseId = 1;
        const dummyBillingPeriods: BillingPeriodList = [["foo", "bar"]];
        const newState = {
          ...initialState,
          byLease: {
            [leaseId]: dummyBillingPeriods,
          },
        };
        const state = billingPeriodsReducer(
          initialState,
          receiveBillingPeriodsByLease({
            leaseId: leaseId,
            billingPeriods: dummyBillingPeriods,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching billing periods", () => {
        const newState = { ...initialState, isFetching: true };
        const state = billingPeriodsReducer(
          initialState,
          fetchBillingPeriodsByLease({
            year: "1234",
            leaseId: 1,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        let state = billingPeriodsReducer(
          initialState,
          fetchBillingPeriodsByLease({
            year: "2000",
            leaseId: 2,
          }),
        );
        state = billingPeriodsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
