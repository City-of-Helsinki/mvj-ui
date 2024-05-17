import { expect } from "chai";
import { receiveBillingPeriodsByLease, fetchBillingPeriodsByLease, notFound } from "./actions";
import billingPeriodsReducer from "./reducer";
import type { BillingPeriodState } from "./types";
const defaultState: BillingPeriodState = {
  byLease: {},
  isFetching: false
};
// @ts-expect-error
describe('Billing periods', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('billingPeriodsReducer', () => {
      // $FlowFixMe
      it('should update billing periods', () => {
        const leaseId = 1;
        const dummyBillingPeriods = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          byLease: {
            [leaseId]: dummyBillingPeriods
          }
        };
        const state = billingPeriodsReducer({}, receiveBillingPeriodsByLease({
          leaseId: leaseId,
          billingPeriods: dummyBillingPeriods
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching billing periods', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = billingPeriodsReducer({}, fetchBillingPeriodsByLease({
          year: 1234,
          leaseId: 1
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state = billingPeriodsReducer({}, fetchBillingPeriodsByLease({
          year: 2000,
          leaseId: 2
        }));
        state = billingPeriodsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});