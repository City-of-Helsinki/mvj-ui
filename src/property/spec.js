// @flow
import {expect} from 'chai';

import {
  attributesNotFound,
  fetchAttributes,
  receiveAttributes,
  fetchPropertyList,
  receivePropertyList,
  fetchSingleProperty,
  receiveSingleProperty,
  editProperty,
  createProperty,
  notFound,
  hideEditMode,
  showEditMode,
  receiveCollapseStates,
  receiveIsSaveClicked,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveMethods,
  deletePlotSearch,
  fetchSinglePlotSearchAfterEdit,
} from './actions';

import propertyReducer from './reducer';

import type {PropertyState} from './types';

const baseState: PropertyState = {
  attributes: null,
  collapseStates: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFormValidById: {
    'property-basic-information-form': true,
    'property-application-form': true,
  },
  isSaveClicked: false,
  list: {},
  methods: null,
};


// $FlowFixMe
describe('Property', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('propertyReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttributes: true};

        const state = propertyReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, attributes: dummyAttributes, isFetchingAttributes: false};

        const state = propertyReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching property list', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = propertyReducer({}, fetchPropertyList(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update property list', () => {
        const dummyPropertyList = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.list = dummyPropertyList;

        const state = propertyReducer({}, receivePropertyList(dummyPropertyList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single property', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = propertyReducer({}, fetchSingleProperty(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current property', () => {
        const dummyProperty = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyProperty;

        const state = propertyReducer({}, receiveSingleProperty(dummyProperty));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by createProperty', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = propertyReducer({}, createProperty({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by editProperty', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = propertyReducer({}, editProperty({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = propertyReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...baseState};
        newState.isSaveClicked = true;

        const state = propertyReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      
      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = propertyReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = propertyReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById', () => {
        const newState = {...baseState};
        const flags = {...newState.isFormValidById};
        flags['property-basic-information-form'] = false;
        newState.isFormValidById = flags;

        const state = propertyReducer({}, receiveFormValidFlags({['property-basic-information-form']: false}));
        expect(state).to.deep.equal(newState);
      });

      it('shoyauld clear isFormValidById', () => {
        const newState = {...baseState};

        let state = propertyReducer({}, receiveFormValidFlags({['property-basic-information-form']: false}));
        state = propertyReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...baseState, isFetchingAttributes: false};

        let state = propertyReducer({}, fetchAttributes());
        state = propertyReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = {...baseState, methods: dummyMethods};

        const state = propertyReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    
      it('fetchSinglePlotSearchAfterEdit function should not change isFetcging flag', () => {
        const state = propertyReducer({}, fetchSinglePlotSearchAfterEdit({id: 1}));
        expect(state).to.deep.equal(baseState);
      });

      it('should update isSaving flag to true deleting plotsearch', () => {
        const dummyPlotSearch = 1;
        const newState = {...baseState, isFetching: true};

        const state = propertyReducer({}, deletePlotSearch(dummyPlotSearch));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...baseState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = propertyReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = propertyReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
