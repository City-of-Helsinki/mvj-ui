// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveRentForPeriodByLease,
  deleteRentForPeriodByLease,
  fetchRentForPeriodByLease,
  receiveIsSaveClicked,
  notFound,
} from './actions';
import rentForPeriodReducer from './reducer';

import type {RentForPeriodState} from './types';

const defaultState: RentForPeriodState = {
  attributes: {},
  byLease: {},
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  methods: {},
};

// $FlowFixMe
describe('Rent for period', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('rentForPeriodReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = rentForPeriodReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = rentForPeriodReducer({}, fetchAttributes());
        state = rentForPeriodReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = rentForPeriodReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = rentForPeriodReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update rent for period list', () => {
        const leaseId = 1;
        const dummyRentForPeriod = {
          id: 1,
          label: 'Foo',
        };
        const newState = {...defaultState, byLease: {[leaseId]: [dummyRentForPeriod]}};

        const state = rentForPeriodReducer({}, receiveRentForPeriodByLease({leaseId: leaseId, rent: dummyRentForPeriod}));
        expect(state).to.deep.equal(newState);
      });

      it('should delete rent for period', () => {
        const leaseId = 1;
        const dummyRentForPeriod = {
          id: 1,
          label: 'Foo',
        };
        const newState = {...defaultState, byLease: {[leaseId]: []}};

        let state = rentForPeriodReducer({}, receiveRentForPeriodByLease({leaseId: leaseId, rent: dummyRentForPeriod}));
        state = rentForPeriodReducer(state, deleteRentForPeriodByLease({leaseId: leaseId, id: 1}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching rent for period', () => {
        const newState = {...defaultState, isFetching: true};

        const state = rentForPeriodReducer({}, fetchRentForPeriodByLease({leaseId: 1, id: 5, allowDelete: false, type: 'test', startDate: '2018-12-12', endDate: '2018-12-12'}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = rentForPeriodReducer({}, fetchRentForPeriodByLease({leaseId: 1, id: 5, allowDelete: false, type: 'test', startDate: '2018-12-12', endDate: '2018-12-12'}));
        state = rentForPeriodReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...defaultState, isSaveClicked: true};

        const state = rentForPeriodReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
