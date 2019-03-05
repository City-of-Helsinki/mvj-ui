// @flow
import {expect} from 'chai';

import {
  receiveAttributes,
  receiveMethods,
  fetchAttributes,
  attributesNotFound,
} from './actions';
import leaseholdTransferReducer from './reducer';

import type {LeaseholdTransferState} from './types';

const defaultState: LeaseholdTransferState = {
  attributes: null,
  isFetchingAttributes: false,
  methods: null,
};

// $FlowFixMe
describe('Leasehold transfer', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('leaseholdTransferReducer', () => {

      // $FlowFixMe
      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = leaseholdTransferReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, methods: dummyMethods};

        const state = leaseholdTransferReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = leaseholdTransferReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = leaseholdTransferReducer({}, fetchAttributes());
        state = leaseholdTransferReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
