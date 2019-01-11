// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
} from './actions';
import setInvoicingStateReducer from './reducer';

import type {SetInvoicingStateState} from './types';

const defaultState: SetInvoicingStateState = {
  attributes: {},
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('Set invoicing state', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('setInvoicingStateReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = setInvoicingStateReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = setInvoicingStateReducer({}, fetchAttributes());
        state = setInvoicingStateReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = setInvoicingStateReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = setInvoicingStateReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
