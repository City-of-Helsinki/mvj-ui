// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
} from './actions';
import setRentInfoCompletionStateReducer from './reducer';

import type {SetRentInfoCompletionStateState} from './types';

const defaultState: SetRentInfoCompletionStateState = {
  attributes: {},
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('Set rent info completion state', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('setRentInfoCompletionStateReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = setRentInfoCompletionStateReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = setRentInfoCompletionStateReducer({}, fetchAttributes());
        state = setRentInfoCompletionStateReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = setRentInfoCompletionStateReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = setRentInfoCompletionStateReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
