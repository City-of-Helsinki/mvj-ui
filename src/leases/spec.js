// @flow
import {expect} from 'chai';
import {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchLeases,
  receiveLeases,
  fetchSingleLease,
  receiveSingleLease,
  fetchLeaseById,
  receiveLeaseById,
  notFoundById,
  createLease,
  patchLease,
  setRentInfoComplete,
  setRentInfoUncomplete,
  startInvoicing,
  stopInvoicing,
  notFound,
  showEditMode,
  hideEditMode,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveIsSaveClicked,
  receiveCollapseStates,
} from './actions';
import leasesReducer from './reducer';

import type {LeaseState} from './types';

const defaultState: LeaseState = {
  attributes: {},
  byId: {},
  collapseStates: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFetchingById: {},
  isFormValidById: {
    'constructability-form': true,
    'contracts-form': true,
    'decisions-form': true,
    'inspections-form': true,
    'lease-areas-form': true,
    'rents-form': true,
    'summary-form': true,
    'tenants-form': true,
  },
  isSaveClicked: false,
  isSaving: false,
  list: {},
  methods: {},
};

// $FlowFixMe
describe('Leases', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('leasesReducer', () => {

      // $FlowFixMe
      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = leasesReducer({}, receiveAttributes(dummyAttributes));
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
        const newState = {...defaultState, methods: dummyMethods};

        const state = leasesReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = leasesReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = leasesReducer({}, fetchAttributes());
        state = leasesReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseList', () => {
        const dummyLeaseList = {
          foo: 'bar',
        };
        const newState = {...defaultState};
        newState.list = dummyLeaseList;

        const state = leasesReducer({}, receiveLeases(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching leases', () => {
        const newState = {...defaultState, isFetching: true};

        const state = leasesReducer({}, fetchLeases(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = leasesReducer({}, fetchLeases(''));
        state = leasesReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update current lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...defaultState, current: dummyLease};

        const state = leasesReducer({}, receiveSingleLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single lease', () => {
        const newState = {...defaultState, isFetching: true};

        const state = leasesReducer({}, fetchSingleLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating new lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...defaultState, isFetching: true};

        const state = leasesReducer({}, createLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when editing existing lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...defaultState, isSaving: true};

        const state = leasesReducer({}, patchLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when starting invoicing', () => {
        const newState = {...defaultState, isSaving: true};

        const state = leasesReducer({}, startInvoicing(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when stoping invoicing', () => {
        const newState = {...defaultState, isSaving: true};

        const state = leasesReducer({}, stopInvoicing(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when setting rent info complete', () => {
        const newState = {...defaultState, isSaving: true};

        const state = leasesReducer({}, setRentInfoComplete(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaving flag to true when setting rent info uncomplete', () => {
        const newState = {...defaultState, isSaving: true};

        const state = leasesReducer({}, setRentInfoUncomplete(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById value', () => {
        const dummyFlags = {
          'constructability-form': true,
          'contracts-form': true,
          'decisions-form': true,
          'inspections-form': false,
          'lease-areas-form': true,
          'rents-form': true,
          'summary-form': true,
          'tenants-form': true,
        };
        const newState = {...defaultState, isFormValidById: dummyFlags};

        const state = leasesReducer({}, receiveFormValidFlags(dummyFlags));
        expect(state).to.deep.equal(newState);
      });

      it('should clear isFormValidById value', () => {
        const dummyFlags = {
          'constructability-form': true,
          'contracts-form': true,
          'decisions-form': true,
          'inspections-form': false,
          'lease-areas-form': true,
          'rents-form': true,
          'summary-form': true,
          'tenants-form': true,
        };
        const newState = {...defaultState};

        let state = leasesReducer({}, receiveFormValidFlags(dummyFlags));
        state = leasesReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {...defaultState, isEditMode: true};

        const state = leasesReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {...defaultState};
        newState.isEditMode = false;

        let state = leasesReducer({}, showEditMode());
        state = leasesReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flag to true when fetching lease by id', () => {
        const leaseId = 1;
        const newState = {...defaultState, isFetchingById: {[leaseId]: true}};

        const state = leasesReducer({}, fetchLeaseById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flag to false by notFoundByLease', () => {
        const leaseId = 1;
        const newState = {...defaultState, isFetchingById: {[leaseId]: false}};

        const state = leasesReducer({}, notFoundById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseById when receiving lease by id', () => {
        const leaseId = 1;
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...defaultState, byId: {[leaseId]: dummyLease}, isFetchingById: {[leaseId]: false}};

        const state = leasesReducer({}, receiveLeaseById({leaseId: leaseId, lease: dummyLease}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...defaultState, isSaveClicked: true};

        const state = leasesReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...defaultState, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = leasesReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = leasesReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
