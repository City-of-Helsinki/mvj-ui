// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchIndexList,
  receiveIndexList,
  notFound,
} from './actions';
import indexReducer from './reducer';

import type {IndexState} from './types';

const defaultState: IndexState = {
  attributes: null,
  isFetchingAttributes: false,
  isFetching: false,
  list: [],
  methods: null,
};

// $FlowFixMe
describe('Index', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('indexReducer', () => {

      // $FlowFixMe
      it('should set isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = indexReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = indexReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};
        const newState = {...defaultState, methods: dummyMethods};

        const state = indexReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = indexReducer({}, fetchAttributes());
        state = indexReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetching flag to true when fetching index list', () => {
        const newState = {...defaultState, isFetching: true};

        const state = indexReducer({}, fetchIndexList({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update index list', () => {
        const dummyIndexList = [{
          foo: 'bar',
        }];
        const newState = {...defaultState, list: dummyIndexList};

        const state = indexReducer({}, receiveIndexList(dummyIndexList));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = indexReducer({}, fetchIndexList({}));
        state = indexReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
