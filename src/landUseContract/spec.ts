import { expect } from "chai";
import { fetchAttributes, receiveAttributes, fetchLandUseContractList, receiveLandUseContractList, fetchSingleLandUseContract, receiveSingleLandUseContract, createLandUseContract, editLandUseContract, notFound, receiveIsSaveClicked, hideEditMode, showEditMode, receiveFormValidFlags, clearFormValidFlags, receiveCollapseStates, receiveMethods, fetchSingleLandUseContractAfterEdit, attributesNotFound, deleteLandUseContract } from "./actions";
import landUseContractReducer from "./reducer";
import type { LandUseContractState } from "./types";
const baseState: LandUseContractState = {
  attributes: null,
  collapseStates: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFormValidById: {
    'land-use-contract-basic-info-form': true,
    'land-use-contract-compensations-form': true,
    'land-use-contract-contracts-form': true,
    'land-use-contract-decisions-form': true,
    'land-use-contract-invoices-form': true,
    'land-use-contract-litigants-form': true,
    'land-use-contract-conditions': true
  },
  isSaveClicked: false,
  list: {},
  methods: null
};
// @ts-expect-error
describe('Land use contract', () => {
  // $FlowFixMe
  describe('Reducer', () => {
    // $FlowFixMe
    describe('landUseContractReducer', () => {
      // $FlowFixMe
      it('should update isFetchingAttributes flag to true', () => {
        const newState = { ...baseState,
          isFetchingAttributes: true
        };
        const state = landUseContractReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...baseState,
          attributes: dummyAttributes,
          isFetchingAttributes: false
        };
        const state = landUseContractReducer({}, receiveAttributes(dummyAttributes));
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
          PUT: true
        };
        const newState = { ...baseState,
          methods: dummyMethods
        };
        const state = landUseContractReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching land use contract list', () => {
        const newState = { ...baseState
        };
        newState.isFetching = true;
        const state = landUseContractReducer({}, fetchLandUseContractList(''));
        expect(state).to.deep.equal(newState);
      });
      it('should update land use contract list', () => {
        const dummyLandUseContractList = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...baseState
        };
        newState.list = dummyLandUseContractList;
        const state = landUseContractReducer({}, receiveLandUseContractList(dummyLandUseContractList));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching single land use contract', () => {
        const newState = { ...baseState
        };
        newState.isFetching = true;
        const state = landUseContractReducer({}, fetchSingleLandUseContract(1));
        expect(state).to.deep.equal(newState);
      });
      it('should update current land use contract', () => {
        const dummyLandUseContract = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...baseState
        };
        newState.current = dummyLandUseContract;
        const state = landUseContractReducer({}, receiveSingleLandUseContract(dummyLandUseContract));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true by createLandUseContract', () => {
        const newState = { ...baseState
        };
        newState.isFetching = true;
        const state = landUseContractReducer({}, createLandUseContract({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true by editLandUseContract', () => {
        const newState = { ...baseState
        };
        newState.isFetching = true;
        const state = landUseContractReducer({}, editLandUseContract({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...baseState
        };
        newState.isFetching = false;
        const state = landUseContractReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update isSaveClicked', () => {
        const newState = { ...baseState
        };
        newState.isSaveClicked = true;
        const state = landUseContractReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = { ...baseState
        };
        newState.isEditMode = false;
        const state = landUseContractReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = { ...baseState
        };
        newState.isEditMode = true;
        const state = landUseContractReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFormValidById', () => {
        const newState = { ...baseState
        };
        const flags = { ...newState.isFormValidById
        };
        flags['land-use-contract-basic-info-form'] = false;
        newState.isFormValidById = flags;
        const state = landUseContractReducer({}, receiveFormValidFlags({
          ['land-use-contract-basic-info-form']: false
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should clear isFormValidById', () => {
        const newState = { ...baseState
        };
        let state = landUseContractReducer({}, receiveFormValidFlags({
          ['land-use-contract-basic-info-form']: false
        }));
        state = landUseContractReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });
      it('fetchSingleLandUseContractAfterEdit function should not change isFetcihng flag', () => {
        const state = landUseContractReducer({}, fetchSingleLandUseContractAfterEdit({
          id: 1
        }));
        expect(state).to.deep.equal(baseState);
      });
      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = { ...baseState,
          isFetchingAttributes: false
        };
        let state = landUseContractReducer({}, fetchAttributes());
        state = landUseContractReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update isSaving flag to true deleting landUseContract', () => {
        const dummyLandUseContract = 1;
        const newState = { ...baseState,
          isFetching: true
        };
        const state = landUseContractReducer({}, deleteLandUseContract(dummyLandUseContract));
        expect(state).to.deep.equal(newState);
      });
      it('should update collapseStates', () => {
        const newState = { ...baseState,
          collapseStates: {
            foo: 'bar',
            foo2: 'bar2'
          }
        };
        let state = landUseContractReducer({}, receiveCollapseStates({
          foo: 'bar'
        }));
        state = landUseContractReducer(state, receiveCollapseStates({
          foo2: 'bar2'
        }));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});