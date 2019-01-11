// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveBillingPeriodsByLease,
  fetchBillingPeriodsByLease,
  notFound,
} from './actions';
import billingPeriodsReducer from './reducer';

import type {BillingPeriodState} from './types';

const defaultState: BillingPeriodState = {
  attributes: {},
  byLease: {},
  isFetching: false,
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('Billing periods', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('billingPeriodsReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = billingPeriodsReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = billingPeriodsReducer({}, fetchAttributes());
        state = billingPeriodsReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = billingPeriodsReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = billingPeriodsReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update billing periods', () => {
        const leaseId = 1;
        const dummyBillingPeriods = {foo: 'bar'};

        const newState = {...defaultState, byLease: {[leaseId]: dummyBillingPeriods}};

        const state = billingPeriodsReducer({}, receiveBillingPeriodsByLease({leaseId: leaseId, billingPeriods: dummyBillingPeriods}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching billing periods', () => {
        const newState = {...defaultState, isFetching: true};

        const state = billingPeriodsReducer({}, fetchBillingPeriodsByLease({year: 1234, leaseId: 1}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = billingPeriodsReducer({}, fetchBillingPeriodsByLease({year: 2000, leaseId: 2}));
        state = billingPeriodsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
