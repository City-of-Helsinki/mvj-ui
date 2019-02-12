// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveMethods,
  fetchContractFilesById,
  receiveContractFilesById,
  notFoundById,
} from './actions';
import contractFileReducer from './reducer';

import type {ContractFileState} from './types';
const defaultState: ContractFileState = {
  byId: {},
  isFetchingAttributes: false,
  isFetchingById: {},
  methods: {},
};

describe('contractFile', () => {

  describe('Reducer', () => {

    describe('contractFileReducer', () => {

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = contractFileReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state: Object = contractFileReducer({}, fetchAttributes());
        state = contractFileReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};
        const newState = {...defaultState, methods: dummyMethods};

        const state = contractFileReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flags when fetching contract files', () => {
        const dummyId = 1;
        const newState = {...defaultState, isFetchingById: {[dummyId]: true}};

        const state = contractFileReducer({}, fetchContractFilesById(dummyId));
        expect(state).to.deep.equal(newState);
      });

      it('should update contract files', () => {
        const dummyId = 1;
        const dummyFiles = [];
        const newState = {...defaultState, byId: {[dummyId]: dummyFiles}, isFetchingById: {[dummyId]: false}};

        const state = contractFileReducer({}, receiveContractFilesById({contractId: dummyId, files: dummyFiles}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flags when by notFoundById', () => {
        const dummyId = 1;
        const newState = {...defaultState, isFetchingById: {[dummyId]: false}};

        let state = contractFileReducer({}, fetchContractFilesById(dummyId));
        state = contractFileReducer(state, notFoundById(dummyId));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
