// @flow
import {expect} from 'chai';

import {
  receiveDecisionsByLease,
  fetchDecisionsByLease,
  notFound,
} from './actions';
import decisionReducer from './reducer';

import type {DecisionState} from './types';

const defaultState: DecisionState = {
  byLease: {},
  isFetching: false,
};

// $FlowFixMe
describe('Decisions', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('decisionReducer', () => {

      // $FlowFixMe
      it('should update decisions received by lease', () => {
        const dummyLease = 1;
        const dummyDecisions = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {...defaultState, byLease: {'1': dummyDecisions}};

        const state = decisionReducer({}, receiveDecisionsByLease({leaseId: dummyLease, decisions: dummyDecisions}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching', () => {
        const newState = {...defaultState, isFetching: true};

        let state = decisionReducer({}, fetchDecisionsByLease(1));
        state = decisionReducer(state, fetchDecisionsByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = decisionReducer({}, fetchDecisionsByLease(1));
        state = decisionReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
