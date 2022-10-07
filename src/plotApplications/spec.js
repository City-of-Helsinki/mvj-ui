// @flow
import {expect} from 'chai';

import {
  fetchPlotApplicationsList,
  receivePlotApplicationsList,
  fetchSinglePlotApplication,
  receiveSinglePlotApplication,
  fetchAttributes,
  receiveMethods,
  attributesNotFound,
  receiveAttributes,
  hideEditMode,
  showEditMode,
  receiveIsSaveClicked,
  receiveCollapseStates,
  receiveFormValidFlags,
  clearFormValidFlags,
  editPlotApplication,
} from './actions';

import plotApplicationReducer from './reducer';

import type {PlotApplicationsState} from './types';

const baseState: PlotApplicationsState = {
  attachmentAttributes: null,
  attachmentMethods: null,
  attachments: null,
  attributes: null,
  currentEditorTargets: [],
  fieldTypeMapping: {},
  form: null,
  isFetching: false,
  isFetchingAttachmentAttributes: false,
  isFetchingAttachments: false,
  isFetchingAttributes: false,
  isFetchingByBBox: false,
  isFetchingPlotSearch: false,
  listByBBox: null,
  isFetchingForm: false,
  isFetchingPendingUploads: false,
  isPerformingFileOperation: false,
  isSaving: false,
  isSaveClicked: false,
  list: {},
  methods: null,
  current: {},
  isEditMode: false,
  isSaveClicked: false,
  collapseStates: {},
  isFormValidById: {
    'plot-application': true,
  },
  subTypes: null,
  pendingUploads: [],
  plotSearch: null,
  isFetchingInfoCheckAttributes: false,
  infoCheckAttributes: null,
  isUpdatingInfoCheck: {},
  lastInfoCheckUpdateSuccessful: {}
};

// $FlowFixMe
describe('PlotApplication', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('plotApplicationReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttributes: true};

        const state = plotApplicationReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, attributes: dummyAttributes, isFetchingAttributes: false};

        const state = plotApplicationReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching plotApplication list', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotApplicationReducer({}, fetchPlotApplicationsList(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update plotApplication list', () => {
        const dummyPlotApplicationsList = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.list = dummyPlotApplicationsList;

        const state = plotApplicationReducer({}, receivePlotApplicationsList(dummyPlotApplicationsList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single plotApplication', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = plotApplicationReducer({}, fetchSinglePlotApplication(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current plotApplication', () => {
        const dummyPlotApplication = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyPlotApplication;

        const state = plotApplicationReducer({}, receiveSinglePlotApplication(dummyPlotApplication));
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

        const state = plotApplicationReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...baseState, isFetchingAttributes: false};

        let state = plotApplicationReducer({}, fetchAttributes());
        state = plotApplicationReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = plotApplicationReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = plotApplicationReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...baseState};
        newState.isSaveClicked = true;

        const state = plotApplicationReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById', () => {
        const newState = {...baseState};
        const flags = {...newState.isFormValidById};
        flags['plot-application'] = false;
        newState.isFormValidById = flags;

        const state = plotApplicationReducer({}, receiveFormValidFlags({['plot-application']: false}));
        expect(state).to.deep.equal(newState);
      });

      it('should clear isFormValidById', () => {
        const newState = {...baseState};

        let state = plotApplicationReducer({}, receiveFormValidFlags({['plot-application']: false}));
        state = plotApplicationReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching and isSaving flags to true by editPlotApplication', () => {
        const newState = {...baseState};
        newState.isFetching = true;
        newState.isSaving = true;

        const state = plotApplicationReducer({}, editPlotApplication({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...baseState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = plotApplicationReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = plotApplicationReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        expect(state).to.deep.equal(newState);
      });

    });
  });
});
