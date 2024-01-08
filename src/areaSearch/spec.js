//@flow

import {expect} from 'chai';

import areaSearchReducer from '$src/areaSearch/reducer';
import {
  areaSearchesByBBoxNotFound,
  areaSearchesNotFound,
  attributesNotFound,
  batchEditAreaSearchInfoChecks,
  editAreaSearch,
  fetchAreaSearchList,
  fetchAreaSearchListByBBox,
  fetchAttributes,
  fetchListAttributes,
  fetchSingleAreaSearch,
  hideEditMode,
  listAttributesNotFound,
  receiveAreaSearchByBBoxList,
  receiveAreaSearchEdited,
  receiveAreaSearchEditFailed,
  receiveAreaSearchList,
  receiveAttributes,
  receiveListAttributes,
  receiveListMethods,
  receiveMethods,
  receiveSingleAreaSearch,
  showEditMode,
  singleAreaSearchNotFound,
} from '$src/areaSearch/actions';
import type {AreaSearchState} from '$src/areaSearch/types';

const defaultState: AreaSearchState = {
  attributes: null,
  methods: null,
  isFetchingAttributes: false,
  listAttributes: null,
  listMethods: null,
  isFetchingListAttributes: false,
  areaSearchList: null,
  areaSearchListByBBox: null,
  isFetchingAreaSearchList: false,
  isFetchingAreaSearchListByBBox: false,
  currentAreaSearch: null,
  isFetchingCurrentAreaSearch: false,
  isEditMode: false,
  isSaveClicked: false,
  collapseStates: {},
  isFormValidById: {},
  isBatchEditingAreaSearchInfoChecks: false,
  isEditingAreaSearch: false,
  lastAreaSearchEditError: null,
  isSubmittingAreaSearchSpecs: false,
  isSubmittingAreaSearchApplication: false,
  isPerformingFileOperation: false,
  lastFileOperationError: null,
};

describe('AreaSearch', () => {
  describe('Reducer', () => {
    describe('areaSearchReducer', () => {
      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = areaSearchReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          foo: 'bar',
        };
        const newState = {...defaultState, methods: dummyMethods};

        const state = areaSearchReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });


      it('should set isFetchingAttributes to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = areaSearchReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes to false when attributes were not found', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        const state = areaSearchReducer({
          isFetchingAttributes: true,
        }, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update list attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };
        const newState = {...defaultState, listAttributes: dummyAttributes};

        const state = areaSearchReducer({}, receiveListAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update list methods', () => {
        const dummyMethods = {
          foo: 'bar',
        };
        const newState = {...defaultState, listMethods: dummyMethods};

        const state = areaSearchReducer({}, receiveListMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingListAttributes to true when fetching list attributes', () => {
        const newState = {...defaultState, isFetchingListAttributes: true};

        const state = areaSearchReducer({}, fetchListAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingListAttributes to false when list attributes were not found', () => {
        const newState = {...defaultState, isFetchingListAttributes: false};

        const state = areaSearchReducer({
          isFetchingListAttributes: true,
        }, listAttributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update area search list', () => {
        const dummyList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {...defaultState, areaSearchList: dummyList, isFetchingAreaSearchList: false};

        const state = areaSearchReducer({
          isFetchingAreaSearchList: true,
        }, receiveAreaSearchList(dummyList));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetching flag when retrieving area searches', () => {
        const newState = {...defaultState, isFetchingAreaSearchList: true};

        const state = areaSearchReducer({}, fetchAreaSearchList());
        expect(state).to.deep.equal(newState);
      });

      it('should unset isFetching flag when area searches could not be fetched', () => {
        const newState = {...defaultState, isFetchingAreaSearchList: false};

        const state = areaSearchReducer({
          isFetchingAreaSearchList: true,
        }, areaSearchesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update area search list by bounding box', () => {
        const dummyList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {...defaultState, areaSearchListByBBox: dummyList, isFetchingAreaSearchListByBBox: false};

        const state = areaSearchReducer({
          isFetchingAreaSearchListByBBox: true,
        }, receiveAreaSearchByBBoxList(dummyList));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetching flag when retrieving area searches by bounding box', () => {
        const newState = {...defaultState, isFetchingAreaSearchListByBBox: true};

        const state = areaSearchReducer({}, fetchAreaSearchListByBBox());
        expect(state).to.deep.equal(newState);
      });

      it('should unset isFetching flag when area searches by bounding box could not be fetched', () => {
        const newState = {...defaultState, isFetchingAreaSearchListByBBox: false};

        const state = areaSearchReducer({
          isFetchingAreaSearchListByBBox: true,
        }, areaSearchesByBBoxNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update current area search', () => {
        const dummySearch = {
          id: 1,
        };
        const newState = {...defaultState, currentAreaSearch: dummySearch, isFetchingCurrentAreaSearch: false};

        const state = areaSearchReducer({
          isFetchingCurrentAreaSearch: true,
        }, receiveSingleAreaSearch(dummySearch));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetching flag when retrieving current area search', () => {
        const newState = {...defaultState, isFetchingCurrentAreaSearch: true};

        const state = areaSearchReducer({}, fetchSingleAreaSearch(1));
        expect(state).to.deep.equal(newState);
      });

      it('should unset isFetching flag when current area search could not be fetched', () => {
        const newState = {...defaultState, isFetchingCurrentAreaSearch: false};

        const state = areaSearchReducer({
          isFetchingCurrentAreaSearch: true,
        }, singleAreaSearchNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should enable edit mode', () => {
        const newState = {...defaultState, isEditMode: true};

        const state = areaSearchReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should disable edit mode', () => {
        const newState = {...defaultState, isEditMode: false};

        const state = areaSearchReducer({
          isEditMode: true,
        }, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should set update flag when batch editing info checks', () => {
        const newState = {...defaultState, isBatchEditingAreaSearchInfoChecks: true};

        const state = areaSearchReducer({
          isBatchEditingAreaSearchInfoChecks: false,
        }, batchEditAreaSearchInfoChecks({
          areaSearch: {},
          applicant: [],
        }));
        expect(state).to.deep.equal(newState);
      });


      it('should set edit flag when updating an area search', () => {
        const newState = {...defaultState, isEditingAreaSearch: true};

        const state = areaSearchReducer({}, editAreaSearch({}));
        expect(state).to.deep.equal(newState);
      });

      it('should unset edit flag when an area search was updated', () => {
        const newState = {...defaultState, isEditingAreaSearch: false};

        const state = areaSearchReducer({
          isEditingAreaSearch: true,
        }, receiveAreaSearchEdited());
        expect(state).to.deep.equal(newState);
      });

      it('should unset edit flag and store the error when an area search could not be updated', () => {
        const newState = {...defaultState, isEditingAreaSearch: false, lastAreaSearchEditError: 'test error'};

        const state = areaSearchReducer({
          isEditingAreaSearch: true,
        }, receiveAreaSearchEditFailed('test error'));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
