// @flow
import {expect} from 'chai';

import {
  attributesNotFound,
  fetchAttributes,
  receiveAttributes,
  fetchPlotSearchList,
  receivePlotSearchList,
  fetchSinglePlotSearch,
  receiveSinglePlotSearch,
  editPlotSearch,
  createPlotSearch,
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
  planUnitNotFound,
  fetchPlanUnit,
  receiveSinglePlanUnit,
  fetchPlanUnitAttributes,
  planUnitAttributesNotFound,
  receivePlanUnitAttributes,
  fetchPlotSearchSubtypes,
  PlotSearchSubtypeNotFound,
  receivePlotSearchSubtype,
} from './actions';

import plotSearchReducer from './reducer';

import type {PlotSearchState} from './types';

const baseState: PlotSearchState = {
  attributes: null,
  collapseStates: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFormValidById: {
    'plot-search-basic-information-form': true,
    'plot-search-application-form': true,
  },
  isSaveClicked: false,
  list: {},
  methods: null,
  planUnitAttributes: null,
  planUnit: {},
  isFetchingPlanUnit: false,
  isFetchingPlanUnitAttributes: false,
  subTypes: null,
};


// $FlowFixMe
describe('PlotSearch', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('plotSearchReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttributes: true};

        const state = plotSearchReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, attributes: dummyAttributes, isFetchingAttributes: false};

        const state = plotSearchReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching plotSearch list', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchPlotSearchList(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update plotSearch list', () => {
        const dummyPlotSearchList = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.list = dummyPlotSearchList;

        const state = plotSearchReducer({}, receivePlotSearchList(dummyPlotSearchList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single plotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchSinglePlotSearch(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current plotSearch', () => {
        const dummyPlotSearch = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyPlotSearch;

        const state = plotSearchReducer({}, receiveSinglePlotSearch(dummyPlotSearch));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by createPlotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, createPlotSearch({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by editPlotSearch', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, editPlotSearch({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = plotSearchReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...baseState};
        newState.isSaveClicked = true;

        const state = plotSearchReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      
      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = plotSearchReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = plotSearchReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById', () => {
        const newState = {...baseState};
        const flags = {...newState.isFormValidById};
        flags['plotSearch-basic-information-form'] = false;
        newState.isFormValidById = flags;

        const state = plotSearchReducer({}, receiveFormValidFlags({['plotSearch-basic-information-form']: false}));
        expect(state).to.deep.equal(newState);
      });

      it('shoyauld clear isFormValidById', () => {
        const newState = {...baseState};

        let state = plotSearchReducer({}, receiveFormValidFlags({['plotSearch-basic-information-form']: false}));
        state = plotSearchReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...baseState, isFetchingAttributes: false};

        let state = plotSearchReducer({}, fetchAttributes());
        state = plotSearchReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPlanUnit flag to false by planUnitNotFound', () => {
        const newState = {...baseState};
        newState.isFetchingPlanUnit = false;

        const state = plotSearchReducer({}, planUnitNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPlanUnitAttributes flag to false by planUnitAttributesNotFound', () => {
        const newState = {...baseState};
        newState.isFetchingPlanUnitAttributes = false;

        const state = plotSearchReducer({}, planUnitAttributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPlanUnit flag to true when fetching fetchPlanUnit', () => {
        const newState = {...baseState};
        newState.isFetchingPlanUnit = true;

        const state = plotSearchReducer({}, fetchPlanUnit(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPlanUnitAttributes flag to true', () => {
        const newState = {...baseState, isFetchingPlanUnitAttributes: true};

        const state = plotSearchReducer({}, fetchPlanUnitAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('fetchSinglePlotSearchAfterEdit function should not change isFetcging flag', () => {
        const state = plotSearchReducer({}, fetchSinglePlotSearchAfterEdit({id: 1}));
        expect(state).to.deep.equal(baseState);
      });

      it('should update subTypes', () => {
        const dummyData = [{
          id: 16,
          name: 'Hinta- ja laatukilpailu',
          plot_search_type: 3,
        }];
        const newState = {...baseState, subTypes: dummyData};

        const state = plotSearchReducer({}, receivePlotSearchSubtype(dummyData));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by PlotSearchSubtypeNotFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = plotSearchReducer({}, PlotSearchSubtypeNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching fetchPlotSearchSubtypes', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotSearchReducer({}, fetchPlotSearchSubtypes());
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

        const state = plotSearchReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true deleting plotsearch', () => {
        const dummyPlotSearch = 1;
        const newState = {...baseState, isFetching: true};

        const state = plotSearchReducer({}, deletePlotSearch(dummyPlotSearch));
        expect(state).to.deep.equal(newState);
      });

      it('should update planUnitAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, planUnitAttributes: {[1]: dummyAttributes}, isFetchingPlanUnitAttributes: false};

        const state = plotSearchReducer({}, receivePlanUnitAttributes({[1]: dummyAttributes}));
        expect(state).to.deep.equal(newState);
      });

      it('should update PlanUnit', () => {
        const dummyPlotSearch = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, planUnit: {[1]: dummyPlotSearch}};

        const state = plotSearchReducer({}, receiveSinglePlanUnit({[1]: dummyPlotSearch}));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...baseState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = plotSearchReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = plotSearchReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        state.planUnit = {};
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
