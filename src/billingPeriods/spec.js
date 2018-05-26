import {expect} from 'chai';
import {
  receiveBillingPeriodsByLease,
  fetchBillingPeriodsByLease,
  notFound,
} from './actions';
import billingPeriodsReducer from './reducer';

describe('Billing periods', () => {

  describe('Reducer', () => {

    describe('billingPeriodsReducer', () => {

      it('should update billing periods', () => {
        const leaseId = 1;
        const dummyBillingPeriods = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          byLease: {[leaseId]: dummyBillingPeriods},
          isFetching: false,
        };

        const state = billingPeriodsReducer({}, receiveBillingPeriodsByLease({leaseId: leaseId, billingPeriods: dummyBillingPeriods}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching billing periods', () => {
        const newState = {
          byLease: {},
          isFetching: true,
        };

        const state = billingPeriodsReducer({}, fetchBillingPeriodsByLease());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          byLease: {},
          isFetching: false,
        };

        let state = billingPeriodsReducer({}, fetchBillingPeriodsByLease());
        state = billingPeriodsReducer(state, notFound([]));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
