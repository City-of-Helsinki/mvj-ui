import {expect} from 'chai';
import {
  fetchCollectionCourtDecisionsByLease,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
} from './actions';
import collectionCourtDecisionReducer from './reducer';

const defaultState = {
  byLease: {},
  isFetchingByLease: {},
};

describe('collectionCourtDecision', () => {

  describe('Reducer', () => {

    describe('collectionCourtDecisionReducer', () => {
      it('should update isFetching flag to true when fetching collection court decisions', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: true};

        const state = collectionCourtDecisionReducer({}, fetchCollectionCourtDecisionsByLease(lease));
        expect(state).to.deep.equal(newState);
      });

      it('should update collection court decision list', () => {
        const lease = 1;
        const dummyCollectionCourtDecisions = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};
        newState.byLease = {[lease]: dummyCollectionCourtDecisions};

        const state = collectionCourtDecisionReducer({}, receiveCollectionCourtDecisionsByLease({lease: lease, collectionCourtDecisions: dummyCollectionCourtDecisions}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFoundByLease', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};

        const state = collectionCourtDecisionReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
