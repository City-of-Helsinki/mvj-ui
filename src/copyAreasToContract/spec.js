// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveMethods,
} from './actions';
import copyAreasToContractReducer from './reducer';

import type {CopyAreasToContractState} from './types';

const defaultState: CopyAreasToContractState = {
  isFetchingAttributes: false,
  methods: null,
};

// $FlowFixMe
describe('Copy areas to contract', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('copyAreasToContractReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = copyAreasToContractReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state: Object = copyAreasToContractReducer({}, fetchAttributes());
        state = copyAreasToContractReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = copyAreasToContractReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
