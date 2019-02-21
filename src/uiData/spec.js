// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchUiDataList,
  receiveUiDataList,
  notFound,
} from './actions';
import uiDataReducer from './reducer';

import type {UiDataState} from './types';

const defaultState: UiDataState = {
  attributes: null,
  isFetching: false,
  isFetchingAttributes: false,
  list: [],
  methods: null,
};

describe('Ui data', () => {

  describe('Reducer', () => {

    describe('uiDataReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'foo',
          val2: 'bar',
        };

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = uiDataReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          val1: 'foo',
          val2: 'bar',
        };

        const newState = {...defaultState, methods: dummyMethods};

        const state = uiDataReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = uiDataReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = uiDataReducer({}, fetchAttributes());
        state = uiDataReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update ui data list', () => {
        const dummyUiDataList = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {...defaultState, list: dummyUiDataList};

        const state = uiDataReducer({}, receiveUiDataList(dummyUiDataList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching ui data list', () => {
        const newState = {...defaultState, isFetching: true};

        const state = uiDataReducer({}, fetchUiDataList());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = uiDataReducer({}, fetchUiDataList());
        state = uiDataReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
