// @flow
import {expect} from 'chai';

import {
  fetchCollectionLetterTemplates,
  receiveCollectionLetterTemplates,
  notFound,
} from './actions';
import collectionLetterTemplateReducer from './reducer';

import type {CollectionLetterTemplateState} from './types';

const defaultState: CollectionLetterTemplateState = {
  isFetching: false,
  list: [],
};

// $FlowFixMe
describe('collectionLetterTemplate', () => {

  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('collectionLetterTemplateReducer', () => {

      // $FlowFixMe
      it('should update isFetching flag to true when fetching collectionLetterTemplates', () => {
        const newState = {...defaultState};
        newState.isFetching = true;

        const state = collectionLetterTemplateReducer({}, fetchCollectionLetterTemplates());
        expect(state).to.deep.equal(newState);
      });

      it('should update contacts list', () => {
        const dummyCollectionLetterTemplateList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...defaultState, list: dummyCollectionLetterTemplateList};

        const state = collectionLetterTemplateReducer({}, receiveCollectionLetterTemplates(dummyCollectionLetterTemplateList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        const state = collectionLetterTemplateReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
