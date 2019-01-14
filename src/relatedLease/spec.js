// @flow
import {expect} from 'chai';
import {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
} from './actions';
import relatedLeaseReducer from './reducer';

import type {RelatedLeaseState} from './types';

const defaultState: RelatedLeaseState = {
  attributes: {},
  isFetchingAttributes: false,
  methods: {},
};

// $FlowFixMe
describe('RelatedLease', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('relatedLeaseReducer', () => {

      // $FlowFixMe
      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = relatedLeaseReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = {...defaultState, methods: dummyMethods};

        const state = relatedLeaseReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = relatedLeaseReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = relatedLeaseReducer({}, fetchAttributes());
        state = relatedLeaseReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
