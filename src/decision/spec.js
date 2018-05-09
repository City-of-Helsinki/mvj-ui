import {expect} from 'chai';
import {
  receiveDecisionsByLease,
  fetchDecisionsByLease,
  notFound,
} from './actions';
import commentReducer from './reducer';

describe('Decisions', () => {

  describe('Reducer', () => {

    describe('decisionReducer', () => {
      it('should update decisions received by lease', () => {
        const dummyLease = 1;
        const dummyDecisions = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          byLease: {1: dummyDecisions},
          isFetching: false,
        };

        const state = commentReducer({}, receiveDecisionsByLease({leaseId: dummyLease, decisions: dummyDecisions}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching', () => {
        const newState = {
          byLease: {},
          isFetching: true,
        };

        const state = commentReducer({}, fetchDecisionsByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          byLease: {},
          isFetching: false,
        };

        const state = commentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
