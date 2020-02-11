// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  fetchReceivableTypes,
  receivableTypesNotFound,
  receiveReceivableTypes,
} from './actions';
import leaseCreateChargeReducer from './reducer';

import type {LeaseCreateChargeState} from './types';

const defaultState: LeaseCreateChargeState = {
  attributes: null,
  isFetchingAttributes: false,
  receivableTypes: null,
  isFetchingReceivableTypes: false,
};

// $FlowFixMe
describe('Lease create charge', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('leaseCreateChargeReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = leaseCreateChargeReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = leaseCreateChargeReducer({}, fetchAttributes());
        state = leaseCreateChargeReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = leaseCreateChargeReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingReceivableTypes flag to true by fetchReceivableTypes', () => {
        const newState = {...defaultState, isFetchingReceivableTypes: true};

        const state = leaseCreateChargeReducer({}, fetchReceivableTypes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingReceivableTypes flag to true by receivableTypesNotFound', () => {
        const newState = {...defaultState, isFetchingReceivableTypes: false};

        let state = leaseCreateChargeReducer({}, fetchReceivableTypes());
        state = leaseCreateChargeReducer(state, receivableTypesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update receivableTypes', () => {
        const dummyReceivableTypes = {foo: 'bar'};

        const newState = {...defaultState, receivableTypes: dummyReceivableTypes};

        const state = leaseCreateChargeReducer({}, receiveReceivableTypes(dummyReceivableTypes));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
