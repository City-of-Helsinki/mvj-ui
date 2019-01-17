// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveInvoiceSetsByLease,
  fetchInvoiceSetsByLease,
  notFound,
} from './actions';
import invoiceSetsReducer from './reducer';

import type {InvoiceSetState} from './types';

const defaultState: InvoiceSetState = {
  attributes: {},
  byLease: {},
  isFetching: false,
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('Invoice sets', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('invoiceSetsReducer', () => {

      // $FlowFixMe
      it('should set isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = invoiceSetsReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = invoiceSetsReducer({}, fetchAttributes());
        state = invoiceSetsReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = invoiceSetsReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, methods: dummyMethods};

        const state = invoiceSetsReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update invoice sets', () => {
        const leaseId = 1;
        const dummyInvoiceSets = [
          {
            id: 1,
            label: 'Foo',
          },
        ];
        const newState = {...defaultState, byLease: {[leaseId]: dummyInvoiceSets}};

        const state = invoiceSetsReducer({}, receiveInvoiceSetsByLease({leaseId: leaseId, invoiceSets: dummyInvoiceSets}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoice sets', () => {
        const newState = {...defaultState, isFetching: true};

        const state = invoiceSetsReducer({}, fetchInvoiceSetsByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = invoiceSetsReducer({}, fetchInvoiceSetsByLease(1));
        state = invoiceSetsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
