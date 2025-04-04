import { describe, expect, it } from "vitest";
import {
  attributesNotFound,
  clearFormValidFlags,
  copyAreasToContract,
  copyDecisionToLeases,
  createCharge,
  createLease,
  createLeaseAndUpdateCurrentLease,
  deleteLease,
  fetchAttributes,
  fetchLeaseById,
  fetchLeases,
  fetchLeasesByBBox,
  fetchSingleLease,
  fetchSingleLeaseAfterEdit,
  hideAttachDecisionModal,
  hideCreateModal,
  hideEditMode,
  notFound,
  notFoundByBBox,
  notFoundById,
  patchLease,
  patchLeaseInvoiceNotes,
  receiveAttributes,
  receiveCollapseStates,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  receiveLeaseById,
  receiveLeases,
  receiveLeasesByBBox,
  receiveMethods,
  receiveSingleLease,
  sendEmail,
  setRentInfoComplete,
  setRentInfoUncomplete,
  showAttachDecisionModal,
  showCreateModal,
  showEditMode,
  startInvoicing,
  stopInvoicing,
  fetchLeasesForContractNumber,
  receiveLeasesForContractNumbers,
} from "./actions";
import leasesReducer from "./reducer";
import type { LeaseState } from "./types";
const defaultState: LeaseState = {
  attributes: null,
  byId: {},
  collapseStates: {},
  current: {},
  isAttachDecisionModalOpen: false,
  isCreateModalOpen: false,
  isEditMode: false,
  isFetching: false,
  isFetchingByBBox: false,
  isFetchingAttributes: false,
  isFetchingById: {},
  isFormValidById: {
    "constructability-form": true,
    "contracts-form": true,
    "decisions-form": true,
    "inspections-form": true,
    "lease-areas-form": true,
    "rents-form": true,
    "summary-form": true,
    "tenants-form": true,
  },
  isSaveClicked: false,
  isSaving: false,
  list: null,
  listByBBox: null,
  methods: null,
  leasesForContractNumbers: null,
  isFetchingLeasesForContractNumbers: false,
};

describe("Leases", () => {
  describe("Reducer", () => {
    describe("leasesReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...defaultState, attributes: dummyAttributes };
        const state = leasesReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = { ...defaultState, methods: dummyMethods };
        const state = leasesReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = leasesReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = leasesReducer({}, fetchAttributes());
        state = leasesReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update leaseList", () => {
        const dummyLeaseList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = { ...defaultState };
        newState.list = dummyLeaseList;
        const state = leasesReducer({}, receiveLeases(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });
      it("should update listByBBox", () => {
        const dummyLeaseList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = { ...defaultState, listByBBox: dummyLeaseList };
        const state = leasesReducer({}, receiveLeasesByBBox(dummyLeaseList));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching leases", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = leasesReducer({}, fetchLeases({ test: "" }));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByBBox flag to true when fetching leases by bbox", () => {
        const newState = { ...defaultState, isFetchingByBBox: true };
        const state = leasesReducer({}, fetchLeasesByBBox({ test: "" }));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when sending email", () => {
        const newState = { ...defaultState, isSaving: true };
        const dummyPayload = {
          type: "constructability",
          lease: 1,
          recipients: [31, 3],
          text: "Testimeili",
        };
        const state = leasesReducer({}, sendEmail(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = leasesReducer({}, fetchLeases({ test: "" }));
        state = leasesReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByBBox flag to false by notFoundByBBox", () => {
        const newState = { ...defaultState, isFetching: false };
        let state = leasesReducer({}, fetchLeasesByBBox({ test: "" }));
        state = leasesReducer({}, notFoundByBBox());
        expect(state).to.deep.equal(newState);
      });
      it("should update current lease", () => {
        const dummyLease = {
          foo: "bar",
        };
        const newState = { ...defaultState, current: dummyLease };
        const state = leasesReducer({}, receiveSingleLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single lease", () => {
        const newState = { ...defaultState, isFetching: true };
        const state = leasesReducer({}, fetchSingleLease(1));
        expect(state).to.deep.equal(newState);
      });
      it("fetchSingleLeaseAfterEdit function should not change isFetcihng flag", () => {
        const state = leasesReducer(
          {},
          fetchSingleLeaseAfterEdit({
            leaseId: 1,
          }),
        );
        expect(state).to.deep.equal(defaultState);
      });
      it("should update isFetching flag to true when creating new lease", () => {
        const dummyLease = {
          foo: "bar",
        };
        const newState = { ...defaultState, isFetching: true };
        const state = leasesReducer({}, createLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when creating new lease and updating current lease", () => {
        const dummyLease = {
          foo: "bar",
        };
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer(
          {},
          createLeaseAndUpdateCurrentLease(dummyLease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when editing lease", () => {
        const dummyLease = {
          foo: "bar",
        };
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, patchLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when editing lease invoice notes", () => {
        const dummyLease = {
          invoice_notes: [
            {
              foo: "bar",
            },
          ],
        };
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, patchLeaseInvoiceNotes(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true deleting lease", () => {
        const dummyLease = 1;
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, deleteLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true by copyAreasToContract", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, copyAreasToContract(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true by copyDecisionToLeases", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, copyDecisionToLeases({ test: 1 }));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when starting invoicing", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, startInvoicing(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when stoping invoicing", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, stopInvoicing(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when setting rent info complete", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, setRentInfoComplete(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when setting rent info uncomplete", () => {
        const newState = { ...defaultState, isSaving: true };
        const state = leasesReducer({}, setRentInfoUncomplete(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFormValidById value", () => {
        const dummyFlags = {
          "constructability-form": true,
          "contracts-form": true,
          "decisions-form": true,
          "inspections-form": false,
          "lease-areas-form": true,
          "rents-form": true,
          "summary-form": true,
          "tenants-form": true,
        };
        const newState = { ...defaultState, isFormValidById: dummyFlags };
        const state = leasesReducer({}, receiveFormValidFlags(dummyFlags));
        expect(state).to.deep.equal(newState);
      });
      it("should clear isFormValidById value", () => {
        const dummyFlags = {
          "constructability-form": true,
          "contracts-form": true,
          "decisions-form": true,
          "inspections-form": false,
          "lease-areas-form": true,
          "rents-form": true,
          "summary-form": true,
          "tenants-form": true,
        };
        const newState = { ...defaultState };
        let state = leasesReducer({}, receiveFormValidFlags(dummyFlags));
        state = leasesReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...defaultState, isEditMode: true };
        const state = leasesReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...defaultState };
        newState.isEditMode = false;
        let state = leasesReducer({}, showEditMode());
        state = leasesReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isAttachDecisionModalOpen flag to true", () => {
        const newState = { ...defaultState, isAttachDecisionModalOpen: true };
        const state = leasesReducer({}, showAttachDecisionModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isAttachDecisionModalOpen flag to false", () => {
        const newState = { ...defaultState };
        newState.isAttachDecisionModalOpen = false;
        let state = leasesReducer({}, showAttachDecisionModal());
        state = leasesReducer({}, hideAttachDecisionModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateModalOpen flag to true", () => {
        const newState = { ...defaultState, isCreateModalOpen: true };
        const state = leasesReducer({}, showCreateModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateModalOpen flag to false", () => {
        const newState = { ...defaultState, isCreateModalOpen: false };
        let state = leasesReducer({}, showCreateModal());
        state = leasesReducer({}, hideCreateModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingById flag to true when fetching lease by id", () => {
        const leaseId = 1;
        const newState = {
          ...defaultState,
          isFetchingById: {
            [leaseId]: true,
          },
        };
        const state = leasesReducer({}, fetchLeaseById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingById flag to false by notFoundByLease", () => {
        const leaseId = 1;
        const newState = {
          ...defaultState,
          isFetchingById: {
            [leaseId]: false,
          },
        };
        const state = leasesReducer({}, notFoundById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update leaseById when receiving lease by id", () => {
        const leaseId = 1;
        const dummyLease = {
          foo: "bar",
        };
        const newState = {
          ...defaultState,
          byId: {
            [leaseId]: dummyLease,
          },
          isFetchingById: {
            [leaseId]: false,
          },
        };
        const state = leasesReducer(
          {},
          receiveLeaseById({
            leaseId: leaseId,
            lease: dummyLease,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...defaultState, isSaveClicked: true };
        const state = leasesReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      it("createCharge should not change state", () => {
        const newState = { ...defaultState };
        const state = leasesReducer(
          {},
          createCharge({
            data: {},
            leaseId: 1,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingLeasesForContractNumbers flag to true when fetching leases for contract numbers", () => {
        const newState = {
          ...defaultState,
          isFetchingLeasesForContractNumbers: true,
        };
        const state = leasesReducer(
          {},
          fetchLeasesForContractNumber({ test: "" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update leasesForContractNumbers", () => {
        const dummyLeaseList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = { ...defaultState };
        newState.leasesForContractNumbers = dummyLeaseList;
        const state = leasesReducer(
          {},
          receiveLeasesForContractNumbers(dummyLeaseList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collapseStates", () => {
        const newState = {
          ...defaultState,
          collapseStates: {
            foo: "bar",
            foo2: "bar2",
          },
        };
        let state = leasesReducer(
          {},
          receiveCollapseStates({
            foo: "bar",
          }),
        );
        state = leasesReducer(
          state,
          receiveCollapseStates({
            foo2: "bar2",
          }),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
