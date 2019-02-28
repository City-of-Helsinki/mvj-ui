// @flow
import {expect} from 'chai';

import {
  fetchInfillDevelopments,
  fetchSingleInfillDevelopment,
  hideEditMode,
  notFound,
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
  receiveFormInitialValues,
  createInfillDevelopment,
  editInfillDevelopment,
  showEditMode,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveIsSaveClicked,
  receiveCollapseStates,
} from './actions';
import infillDevelopmentReducer from './reducer';

import type {InfillDevelopmentState} from './types';

const defaultState: InfillDevelopmentState = {
  attributes: null,
  collapseStates: {},
  current: {},
  initialValues: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFormValidById: {
    'infill-development-form': true,
  },
  isSaveClicked: false,
  isSaving: false,
  list: {},
  methods: null,
};

// $FlowFixMe
describe('Infill development', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('infillDevelopmentReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = infillDevelopmentReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state: Object = infillDevelopmentReducer({}, fetchAttributes());
        state = infillDevelopmentReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = infillDevelopmentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, methods: dummyMethods};

        const state = infillDevelopmentReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update infill development list', () => {
        const dummyInfillDevelopmentList = {foo: 'bar'};

        const newState = {...defaultState};
        newState.list = dummyInfillDevelopmentList;

        const state =infillDevelopmentReducer({}, receiveInfillDevelopments(dummyInfillDevelopmentList));
        expect(state).to.deep.equal(newState);
      });

      it('should update current infill development', () => {
        const dummyInfillDevelopment = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState};
        newState.current = dummyInfillDevelopment;

        const state =infillDevelopmentReducer({}, receiveSingleInfillDevelopment(dummyInfillDevelopment));
        expect(state).to.deep.equal(newState);
      });

      it('should update form initial values', () => {
        const dummyInfillDevelopment = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState};
        newState.initialValues = dummyInfillDevelopment;

        const state =infillDevelopmentReducer({}, receiveFormInitialValues(dummyInfillDevelopment));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching infill developments', () => {
        const newState = {...defaultState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, fetchInfillDevelopments({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single infill development', () => {
        const newState = {...defaultState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, fetchSingleInfillDevelopment(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when creating infill development', () => {
        const newState = {...defaultState};
        newState.isSaving = true;

        const state = infillDevelopmentReducer({}, createInfillDevelopment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when editing infill development', () => {
        const newState = {...defaultState};
        newState.isSaving = true;

        const state = infillDevelopmentReducer({}, editInfillDevelopment({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState};

        const state = infillDevelopmentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...defaultState};
        newState.isEditMode = false;

        const state = infillDevelopmentReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by hideEditMode', () => {
        const newState = {...defaultState};
        newState.isEditMode = true;

        const state = infillDevelopmentReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById value', () => {
        const dummyFlags = {
          'infill-development-form': true,
        };

        const newState = {...defaultState};
        newState.isFormValidById = dummyFlags;

        const state = infillDevelopmentReducer({}, receiveFormValidFlags(dummyFlags));
        expect(state).to.deep.equal(newState);
      });

      it('should clear isFormValidById value', () => {
        const dummyFlags = {
          'infill-development-form': true,
        };
        const newState = {...defaultState};


        let state: Object = infillDevelopmentReducer({}, receiveFormValidFlags(dummyFlags));
        state = infillDevelopmentReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...defaultState};
        newState.isSaveClicked = true;

        const state = infillDevelopmentReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...defaultState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state: Object = infillDevelopmentReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = infillDevelopmentReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
