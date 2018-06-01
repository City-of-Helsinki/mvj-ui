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
  notFound,
  showContactModal,
  hideContactModal,
  receiveContactModalSettings,
  showEditMode,
  hideEditMode,
  receiveConstructabilityFormValid,
  receiveContractsFormValid,
  receiveDecisionsFormValid,
  receiveInspectionsFormValid,
  receiveLeaseAreasFormValid,
  receiveLeaseInfoFormValid,
  receiveRentsFormValid,
  receiveSummaryFormValid,
  receiveTenantsFormValid,
  clearFormValidFlags,
  showDeleteRelatedLeaseModal,
  hideDeleteRelatedLeaseModal,
} from './actions';
import leasesReducer from './reducer';

const stateTemplate = {
  attributes: {},
  byId: {},
  contactModalSettings: null,
  current: {},
  isConstructabilityFormValid: true,
  isContactModalOpen: false,
  isContractsFormValid: true,
  isDecisionsFormValid: true,
  isDeleteRelatedLeaseModalOpen: false,
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isFetchingById: {},
  isInspectionsFormValid: true,
  isLeaseAreasFormValid: true,
  isLeaseInfoFormValid: true,
  isRentsFormValid: true,
  isSummaryFormValid: true,
  isTenantsFormValid: true,
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

      it('should update isContactModalOpen flag to true', () => {
        const newState = {...stateTemplate};
        newState.isContactModalOpen = true;

        const state = leasesReducer({}, showContactModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isContactModalOpen flag to false', () => {
        const newState = {...stateTemplate};
        newState.isContactModalOpen = false;

        let state = leasesReducer({}, showContactModal());
        state = leasesReducer({}, hideContactModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update contactModalSettings', () => {
        const dummySettings = {
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.contactModalSettings = dummySettings;

        const state = leasesReducer({}, receiveContactModalSettings(dummySettings));
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

      it('should update isConstructabilityFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isConstructabilityFormValid = false;

        const state = leasesReducer({}, receiveConstructabilityFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isContractsFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isContractsFormValid = false;

        const state = leasesReducer({}, receiveContractsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isDecisionsFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isDecisionsFormValid = false;

        const state = leasesReducer({}, receiveDecisionsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isInspectionsFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isInspectionsFormValid = false;

        const state = leasesReducer({}, receiveInspectionsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isLeaseAreasFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isLeaseAreasFormValid = false;

        const state = leasesReducer({}, receiveLeaseAreasFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isLeaseInfoFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isLeaseInfoFormValid = false;

        const state = leasesReducer({}, receiveLeaseInfoFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isRentsFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isRentsFormValid = false;

        const state = leasesReducer({}, receiveRentsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSummaryFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isSummaryFormValid = false;

        const state = leasesReducer({}, receiveSummaryFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isTenantsFormValid flag to false', () => {
        const newState = {...stateTemplate};
        newState.isTenantsFormValid = false;

        const state = leasesReducer({}, receiveTenantsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update all form valid flags to true', () => {
        const newState = {...stateTemplate};
        newState.isConstructabilityFormValid = true;
        newState.isContractsFormValid = true;
        newState.isDecisionsFormValid = true;
        newState.isInspectionsFormValid = true;
        newState.isLeaseAreasFormValid = true;
        newState.isLeaseInfoFormValid = true;
        newState.isRentsFormValid = true;
        newState.isSummaryFormValid = true;
        newState.isTenantsFormValid = true;

        let state = leasesReducer({}, receiveConstructabilityFormValid(false));
        state = leasesReducer(state, receiveContractsFormValid(false));
        state = leasesReducer(state, receiveDecisionsFormValid(false));
        state = leasesReducer(state, receiveInspectionsFormValid(false));
        state = leasesReducer(state, receiveLeaseAreasFormValid(false));
        state = leasesReducer(state, receiveLeaseInfoFormValid(false));
        state = leasesReducer(state, receiveRentsFormValid(false));
        state = leasesReducer(state, receiveSummaryFormValid(false));
        state = leasesReducer(state, receiveTenantsFormValid(false));
        state = leasesReducer(state, clearFormValidFlags());
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

      it('should update isDeleteRelatedLeaseModalOpen to true', () => {
        const newState = {...stateTemplate};
        newState.isDeleteRelatedLeaseModalOpen = true;

        const state = leasesReducer({}, showDeleteRelatedLeaseModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isDeleteRelatedLeaseModalOpen to false', () => {
        const newState = {...stateTemplate};
        newState.isDeleteRelatedLeaseModalOpen = false;

        const state = leasesReducer({}, hideDeleteRelatedLeaseModal());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
