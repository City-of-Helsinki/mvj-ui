import {expect} from 'chai';
import {
  fetchCollectionLettersByLease,
  receiveCollectionLettersByLease,
  notFoundByLease,
} from './actions';
import collectionLetterReducer from './reducer';

const defaultState = {
  byLease: {},
  isFetchingByLease: {},
};

describe('collectionLetter', () => {

  describe('Reducer', () => {

    describe('collectionLetterReducer', () => {
      it('should update isFetching flag to true when fetching collection letters', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: true};

        const state = collectionLetterReducer({}, fetchCollectionLettersByLease(lease));
        expect(state).to.deep.equal(newState);
      });

      it('should update collection letter list', () => {
        const lease = 1;
        const dummyCollectionLetters = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};
        newState.byLease = {[lease]: dummyCollectionLetters};

        const state = collectionLetterReducer({}, receiveCollectionLettersByLease({lease: lease, collectionLetters: dummyCollectionLetters}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFoundByLease', () => {
        const lease = 1;
        const newState = {...defaultState};
        newState.isFetchingByLease = {[lease]: false};

        const state = collectionLetterReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
