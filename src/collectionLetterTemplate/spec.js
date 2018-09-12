import {expect} from 'chai';
import {
  fetchCollectionLetterTemplates,
  receiveCollectionLetterTemplates,
  notFound,
} from './actions';
import collectionLetterTemplateReducer from './reducer';

const defaultState = {
  isFetching: false,
  list: [],
};

describe('collectionLetterTemplate', () => {

  describe('Reducer', () => {

    describe('collectionLetterTemplateReducer', () => {
      it('should update isFetching flag to true when fetching collectionLetterTemplates', () => {
        const newState = {...defaultState};
        newState.isFetching = true;

        const state = collectionLetterTemplateReducer({}, fetchCollectionLetterTemplates(''));
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

        const newState = {...defaultState};
        newState.list = {dummyCollectionLetterTemplateList};

        const state = collectionLetterTemplateReducer({}, receiveCollectionLetterTemplates({dummyCollectionLetterTemplateList}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState};
        newState.isFetching = false;

        const state = collectionLetterTemplateReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
