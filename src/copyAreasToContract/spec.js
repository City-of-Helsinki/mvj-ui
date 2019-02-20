// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
} from './actions';
import copyAreasToContractReducer from './reducer';

import type {CopyAreasToContractState} from './types';

const defaultState: CopyAreasToContractState = {
  attributes: null,
  isFetchingAttributes: false,
  methods: null,
};

describe('Copy areas to contract', () => {

  describe('Reducer', () => {

    describe('copyAreasToContractReducer', () => {

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

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = copyAreasToContractReducer({}, receiveAttributes(dummyAttributes));
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
