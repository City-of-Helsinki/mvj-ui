import { expect } from "chai";
import { fetchAttributes, attributesNotFound, receiveAttributes, receiveMethods, fetchCollectionLettersByLease, receiveCollectionLettersByLease, notFoundByLease, uploadCollectionLetter, deleteCollectionLetter } from "./actions";
import collectionLetterReducer from "./reducer";
import type { CollectionLetterState } from "./types";
const defaultState: CollectionLetterState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  methods: null
};
// @ts-expect-error
describe('collectionLetter', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('collectionLetterReducer', () => {
      // $FlowFixMe
      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: true
        };
        const state = collectionLetterReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: false
        };
        let state = collectionLetterReducer({}, fetchAttributes());
        state = collectionLetterReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          attributes: dummyAttributes
        };
        const state = collectionLetterReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update methods', () => {
        const dummyMethods = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          methods: dummyMethods
        };
        const state = collectionLetterReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching collection letters', () => {
        const lease = 1;
        const newState = { ...defaultState,
          isFetchingByLease: {
            [lease]: true
          }
        };
        const state = collectionLetterReducer({}, fetchCollectionLettersByLease(lease));
        expect(state).to.deep.equal(newState);
      });
      it('should update collection letter list', () => {
        const lease = 1;
        const dummyCollectionLetters = [{
          id: 1,
          label: 'Foo',
          name: 'Bar'
        }];
        const newState = { ...defaultState,
          isFetchingByLease: {
            [lease]: false
          },
          byLease: {
            [lease]: dummyCollectionLetters
          }
        };
        const state = collectionLetterReducer({}, receiveCollectionLettersByLease({
          lease: lease,
          collectionLetters: dummyCollectionLetters
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFoundByLease', () => {
        const lease = 1;
        const newState = { ...defaultState,
          isFetchingByLease: {
            [lease]: false
          }
        };
        const state = collectionLetterReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
      it('uploadCollectionLetter should not change state', () => {
        const state = collectionLetterReducer({}, uploadCollectionLetter({
          data: {
            lease: 1
          },
          file: {}
        }));
        expect(state).to.deep.equal(defaultState);
      });
      it('deleteCollectionLetter should not change state', () => {
        const state = collectionLetterReducer({}, deleteCollectionLetter({
          id: 1,
          lease: 1
        }));
        expect(state).to.deep.equal(defaultState);
      });
    });
  });
});