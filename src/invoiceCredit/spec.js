// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
} from './actions';
import invoiceCreditReducer from './reducer';

import type {InvoiceCreditState} from './types';

const defaultState: InvoiceCreditState = {
  attributes: {},
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('Invoice credit', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('invoiceCreditReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = invoiceCreditReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = invoiceCreditReducer({}, fetchAttributes());
        state = invoiceCreditReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = invoiceCreditReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = invoiceCreditReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
