// @flow
import {expect} from 'chai';
import {
  fetchLeaseTypes,
  receiveLeaseTypes,
  notFound,
} from './actions';
import leaseTypeReducer from './reducer';

import type {LeaseTypeState} from './types';

const defaultStates: LeaseTypeState = {
  isFetching: false,
  list: [],
};


// $FlowFixMe
describe('Lease types', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('leaseTypeReducer', () => {

      // $FlowFixMe
      it('should update isFetching flag to true when fetching lease types', () => {
        const newState = {...defaultStates};
        newState.isFetching = true;

        const state = leaseTypeReducer({}, fetchLeaseTypes());
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseList', () => {
        const dummyLeaseTypeList = [
          {foo: 'bar'},
        ];
        const newState = {...defaultStates};
        newState.list = dummyLeaseTypeList;

        const state = leaseTypeReducer({}, receiveLeaseTypes(dummyLeaseTypeList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultStates};
        newState.isFetching = false;

        let state = leaseTypeReducer({}, fetchLeaseTypes());
        state = leaseTypeReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
