import {expect} from 'chai';
import {
  fetchCollectionNotesByLease,
  receiveCollectionNotesByLease,
  notFoundByLease,
} from './actions';
import collectionNoteReducer from './reducer';

const defaultState = {
  byLease: {},
  isFetchingByLease: {},
};

describe('collectionNote', () => {

  describe('Reducer', () => {

    describe('collectionNoteReducer', () => {
      it('should update isFetching flag to true when fetching collection notes', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: true};

        const state = collectionNoteReducer({}, fetchCollectionNotesByLease(lease));
        expect(state).to.deep.equal(newState);
      });

      it('should update collection note list', () => {
        const lease = 1;
        const dummyCollectionNotes = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};
        newState.byLease = {[lease]: dummyCollectionNotes};

        const state = collectionNoteReducer({}, receiveCollectionNotesByLease({lease: lease, collectionNotes: dummyCollectionNotes}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFoundByLease', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};

        const state = collectionNoteReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
