import {expect} from 'chai';
import {
  fetchAttributes,
  receiveAttributes,
  fetchLeases,
  receiveLeases,
  fetchSingleLease,
  receiveSingleLease,
  fetchLeaseById,
  receiveLeaseById,
  notFoundById,
  createLease,
  patchLease,
  archiveLeaseArea,
  unarchiveLeaseArea,
  notFound,
  showEditMode,
  hideEditMode,
  hideArchiveAreaModal,
  showArchiveAreaModal,
  hideUnarchiveAreaModal,
  showUnarchiveAreaModal,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveIsSaveClicked,
  receiveCollapseStates,
} from './actions';
import leasesReducer from './reducer';

const stateTemplate = {
  attributes: {},
  byId: {},
  collapseStates: {},
  current: {},
  isArchiveAreaModalOpen: false,
  isArchiveFetching: false,
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
    'lease-info-form': true,
    'rents-form': true,
    'summary-form': true,
    'tenants-form': true,
  },
  isSaveClicked: false,
  isUnarchiveAreaModalOpen: false,
  list: {},
};

describe('Leases', () => {

  describe('Reducer', () => {

    describe('leasesReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.attributes = dummyAttributes;

        const state = leasesReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...stateTemplate};
        newState.isFetchingAttributes = true;

        const state = leasesReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseList', () => {
        const dummyLeaseList = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.list = dummyLeaseList;

        const state = leasesReducer({}, receiveLeases(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching leases', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = leasesReducer({}, fetchLeases());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...stateTemplate};
        newState.isFetching = false;

        let state = leasesReducer({}, fetchLeases());
        state = leasesReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update current lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.current = dummyLease;

        const state = leasesReducer({}, receiveSingleLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single lease', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = leasesReducer({}, fetchSingleLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating new lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = leasesReducer({}, createLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing existing lease', () => {
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = leasesReducer({}, patchLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isArchiveFetching flag to true when archiving lease area', () => {
        const newState = {...stateTemplate, isArchiveFetching: true};

        const state = leasesReducer({}, archiveLeaseArea());
        expect(state).to.deep.equal(newState);
      });

      it('should update isArchiveFetching flag to true when unarchiving lease area', () => {
        const newState = {...stateTemplate, isArchiveFetching: true};

        const state = leasesReducer({}, unarchiveLeaseArea());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById value', () => {
        const dummyFlags = {
          'constructability-form': true,
          'contracts-form': true,
          'decisions-form': true,
          'inspections-form': false,
          'lease-areas-form': true,
          'lease-info-form': false,
          'rents-form': true,
          'summary-form': true,
          'tenants-form': true,
        };
        const newState = {...stateTemplate};
        newState.isFormValidById = dummyFlags;

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
          'lease-info-form': false,
          'rents-form': true,
          'summary-form': true,
          'tenants-form': true,
        };
        const newState = {...stateTemplate};

        let state = leasesReducer({}, receiveFormValidFlags(dummyFlags));
        state = leasesReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {...stateTemplate};
        newState.isEditMode = true;

        const state = leasesReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {...stateTemplate};
        newState.isEditMode = false;

        let state = leasesReducer({}, showEditMode());
        state = leasesReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isArchiveAreaModalOpen flag to true', () => {
        const newState = {...stateTemplate};
        newState.isArchiveAreaModalOpen = true;

        const state = leasesReducer({}, showArchiveAreaModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isArchiveAreaModalOpen flag to false', () => {
        const newState = {...stateTemplate};
        newState.isArchiveAreaModalOpen = false;

        const state = leasesReducer({}, hideArchiveAreaModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isUnarchiveAreaModalOpen flag to true', () => {
        const newState = {...stateTemplate};
        newState.isUnarchiveAreaModalOpen = true;

        const state = leasesReducer({}, showUnarchiveAreaModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isUnarchiveAreaModalOpen flag to false', () => {
        const newState = {...stateTemplate};
        newState.isUnarchiveAreaModalOpen = false;

        const state = leasesReducer({}, hideUnarchiveAreaModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flag to true when fetching lease by id', () => {
        const leaseId = 1;
        const newState = {...stateTemplate};
        newState.isFetchingById = {[leaseId]: true};

        const state = leasesReducer({}, fetchLeaseById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flag to false by notFoundByLease', () => {
        const leaseId = 1;
        const newState = {...stateTemplate};
        newState.isFetchingById = {[leaseId]: false};

        const state = leasesReducer({}, notFoundById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseById when receiving lease by id', () => {
        const leaseId = 1;
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.byId = {[leaseId]: dummyLease};
        newState.isFetchingById = {[leaseId]: false};

        const state = leasesReducer({}, receiveLeaseById({leaseId: leaseId, lease: dummyLease}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...stateTemplate};
        newState.isSaveClicked = true;

        const state = leasesReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const newState = {...stateTemplate, collapseStates: {foo: 'bar', foo2: 'bar2'}};

        let state = leasesReducer({}, receiveCollapseStates({foo: 'bar'}));
        state = leasesReducer(state, receiveCollapseStates({foo2: 'bar2'}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
