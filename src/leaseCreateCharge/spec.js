// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
} from './actions';
import leaseCreateChargeReducer from './reducer';

import type {LeaseCreateChargeState} from './types';

const defaultState: LeaseCreateChargeState = {
  attributes: {},
  isFetchingAttributes: false,
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
    });
  });
});
