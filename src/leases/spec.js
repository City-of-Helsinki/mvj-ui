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
} from './actions';
import leasesReducer from './reducer';

describe('Leases', () => {

  describe('Reducer', () => {

    describe('leasesReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar',
        };

        const newState = {
          attributes: dummyAttributes,
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        const state = leasesReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: true,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true when receiving attributes', () => {
        const dummyAttributes = {
          boo: 'bar',
        };

        const newState = {
          attributes: dummyAttributes,
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        let state = leasesReducer({}, fetchAttributes());
        state = leasesReducer(state, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseList', () => {
        const dummyLeaseList = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingById: {},
          isFetchingAttributes: false,
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: dummyLeaseList,
        };

        const state = leasesReducer({}, receiveLeases(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching leases', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: true,
          isFetchingById: {},
          isFetchingAttributes: false,
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, fetchLeases());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving leases', () => {
        const dummyLeaseList = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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
          list: dummyLeaseList,
        };

        let state = leasesReducer({}, fetchLeases());
        state = leasesReducer(state, receiveLeases(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });

      it('should update current lease', () => {
        const dummyLease = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: dummyLease,
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        const state = leasesReducer({}, receiveSingleLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single lease', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: true,
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

        const state = leasesReducer({}, fetchSingleLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving single lease', () => {
        const dummyLease = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: dummyLease,
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        let state = leasesReducer({}, fetchSingleLease(1));
        state = leasesReducer(state, receiveSingleLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating new lease', () => {
        const dummyLease = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: true,
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

        const state = leasesReducer({}, createLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing existing lease', () => {
        const dummyLease = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: true,
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

        const state = leasesReducer({}, patchLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing existing lease', () => {
        const dummyLease = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        let state = leasesReducer({}, patchLease(dummyLease));
        state = leasesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isContactModalOpen flag to true', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: true,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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


        const state = leasesReducer({}, showContactModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update isContactModalOpen flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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


        let state = leasesReducer({}, showContactModal());
        state = leasesReducer({}, hideContactModal());
        expect(state).to.deep.equal(newState);
      });

      it('should update contactModalSettings', () => {
        const dummySettings = {
          foo: 'bar',
        };

        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: dummySettings,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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

        const state = leasesReducer({}, receiveContactModalSettings(dummySettings));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: true,
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


        const state = leasesReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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


        let state = leasesReducer({}, showEditMode());
        state = leasesReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isConstructabilityFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: false,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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


        const state = leasesReducer({}, receiveConstructabilityFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isContractsFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: false,
          isDecisionsFormValid: true,
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

        const state = leasesReducer({}, receiveContractsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isDecisionsFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: false,
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

        const state = leasesReducer({}, receiveDecisionsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isInspectionsFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: false,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveInspectionsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isLeaseAreasFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: false,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveLeaseAreasFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isLeaseInfoFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: false,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveLeaseInfoFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isRentsFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: false,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveRentsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isSummaryFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: false,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveSummaryFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update isTenantsFormValid flag to false', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingAttributes: false,
          isFetchingById: {},
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: false,
          list: {},
        };

        const state = leasesReducer({}, receiveTenantsFormValid(false));
        expect(state).to.deep.equal(newState);
      });

      it('should update all form valid flags to true', () => {
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
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
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingById: {[leaseId]: true},
          isFetchingAttributes: false,
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, fetchLeaseById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingById flag to false by notFoundByLease', () => {
        const leaseId = 1;
        const newState = {
          attributes: {},
          byId: {},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingById: {[leaseId]: false},
          isFetchingAttributes: false,
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, notFoundById(leaseId));
        expect(state).to.deep.equal(newState);
      });

      it('should update leaseById when receiving lease by id', () => {
        const leaseId = 1;
        const dummyLease = {
          foo: 'bar',
        };
        const newState = {
          attributes: {},
          byId: {[leaseId]: dummyLease},
          contactModalSettings: null,
          current: {},
          isConstructabilityFormValid: true,
          isContactModalOpen: false,
          isContractsFormValid: true,
          isDecisionsFormValid: true,
          isEditMode: false,
          isFetching: false,
          isFetchingById: {[leaseId]: false},
          isFetchingAttributes: false,
          isInspectionsFormValid: true,
          isLeaseAreasFormValid: true,
          isLeaseInfoFormValid: true,
          isRentsFormValid: true,
          isSummaryFormValid: true,
          isTenantsFormValid: true,
          list: {},
        };

        const state = leasesReducer({}, receiveLeaseById({leaseId: leaseId, lease: dummyLease}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
