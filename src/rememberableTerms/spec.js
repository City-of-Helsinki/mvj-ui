import {expect} from 'chai';
import {
  receiveRememberableTermList,
  fetchRememberableTermList,
  createRememberableTerm,
  deleteRememberableTerm,
  editRememberableTerm,
  notFound,
  showEditMode,
  hideEditMode,
  initializeRememberableTerm,
} from './actions';
import rememberableTermsReducer from './reducer';

describe('RememberableTermsList', () => {

  describe('Reducer', () => {

    describe('rememberableTermsReducer', () => {

      it('should update rememberable terms list', () => {
        const dummyRememberableTerms = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: false,
          list: dummyRememberableTerms,
        };

        const state = rememberableTermsReducer({}, receiveRememberableTermList(dummyRememberableTerms));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching rememberable terms', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: true,
          list: [],
        };

        const state = rememberableTermsReducer({}, fetchRememberableTermList());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating rememberable term', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: true,
          list: [],
        };

        const state = rememberableTermsReducer({}, createRememberableTerm());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when deleting rememberable term', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: true,
          list: [],
        };

        const state = rememberableTermsReducer({}, deleteRememberableTerm());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing rememberable term', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: true,
          list: [],
        };

        const state = rememberableTermsReducer({}, editRememberableTerm());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound action', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: false,
          list: [],
        };

        let state = rememberableTermsReducer({}, editRememberableTerm());
        state = rememberableTermsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: true,
          isFetching: false,
          list: [],
        };

        const state = rememberableTermsReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {
          initialValues: {
            comment: '',
            id: -1,
            geoJSON: {},
            isNew: true,
          },
          isEditMode: false,
          isFetching: false,
          list: [],
        };

        let state = rememberableTermsReducer({}, showEditMode());
        state = rememberableTermsReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update initial values', () => {
        const newState = {
          initialValues: {},
          isEditMode: false,
          isFetching: false,
          list: [],
        };

        const state = rememberableTermsReducer({}, initializeRememberableTerm({}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
