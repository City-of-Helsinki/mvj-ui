// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionLetterTemplates,
  receiveCollectionLetterTemplates,
  notFound,
} from './actions';
import collectionLetterTemplateReducer from './reducer';

import type {CollectionLetterTemplateState} from './types';

const defaultState: CollectionLetterTemplateState = {
  attributes: {},
  isFetching: false,
  isFetchingAttributes: false,
  list: [],
  methods: {},
};

// $FlowFixMe
describe('collectionLetterTemplate', () => {

  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('collectionLetterTemplateReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = collectionLetterTemplateReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = collectionLetterTemplateReducer({}, fetchAttributes());
        state = collectionLetterTemplateReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = collectionLetterTemplateReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};
        const newState = {...defaultState, methods: dummyMethods};

        const state = collectionLetterTemplateReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

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
