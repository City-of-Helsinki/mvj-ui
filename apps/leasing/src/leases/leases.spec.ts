import { describe, expect, it } from "vitest";
import leasesReducer, {
  attributesNotFound,
  copyDecisionToLeases,
  createCharge,
  createLease,
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
  fetchLeasesForContractNumbers,
  receiveLeasesForContractNumbers,
  receiveIsCreateClicked,
  fetchLeasesForContact,
  receiveLeasesForContact,
  fetchLeasesForContactAttributes,
  receiveLeasesForContactAttributes,
  initialState,
} from "./slice";
import type { Lease } from "./types";

const dummyLease: Lease = {
  foo: "bar",
} as unknown as Lease;

describe("Leases", () => {
  describe("Reducer", () => {
    describe("leasesReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = leasesReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
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
        const newState = { ...initialState, methods: dummyMethods };
        const state = leasesReducer(initialState, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = leasesReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = leasesReducer(initialState, fetchAttributes());
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
        const newState = { ...initialState };
        newState.list = dummyLeaseList;
        const state = leasesReducer(
          initialState,
          receiveLeases(dummyLeaseList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update listByBBox", () => {
        const dummyLeaseList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = { ...initialState, listByBBox: dummyLeaseList };
        const state = leasesReducer(
          initialState,
          receiveLeasesByBBox(dummyLeaseList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching leases", () => {
        const newState = { ...initialState, isFetching: true };
        const state = leasesReducer(initialState, fetchLeases({ test: "" }));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByBBox flag to true when fetching leases by bbox", () => {
        const newState = { ...initialState, isFetchingByBBox: true };
        const state = leasesReducer(
          initialState,
          fetchLeasesByBBox({ test: "" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when sending email", () => {
        const newState = { ...initialState, isSaving: true };
        const dummyPayload = {
          type: "constructability",
          lease: 1,
          recipients: [31, 3],
          text: "Testimeili",
        };
        const state = leasesReducer(initialState, sendEmail(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        let state = leasesReducer(initialState, fetchLeases({ test: "" }));
        state = leasesReducer(initialState, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingByBBox flag to false by notFoundByBBox", () => {
        const newState = { ...initialState, isFetching: false };
        let state = leasesReducer(
          initialState,
          fetchLeasesByBBox({ test: "" }),
        );
        state = leasesReducer(initialState, notFoundByBBox());
        expect(state).to.deep.equal(newState);
      });
      it("should update current lease", () => {
        const newState = { ...initialState, current: dummyLease };
        const state = leasesReducer(
          initialState,
          receiveSingleLease(dummyLease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single lease", () => {
        const newState = { ...initialState, isFetching: true };
        const state = leasesReducer(initialState, fetchSingleLease(1));
        expect(state).to.deep.equal(newState);
      });
      it("fetchSingleLeaseAfterEdit function should not change isFetcihng flag", () => {
        const state = leasesReducer(
          initialState,
          fetchSingleLeaseAfterEdit({
            leaseId: 1,
          }),
        );
        expect(state).to.deep.equal(initialState);
      });
      it("should update isFetching flag to true when creating new lease", () => {
        const newState = { ...initialState, isFetching: true };
        const state = leasesReducer(initialState, createLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when editing lease", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, patchLease(dummyLease));
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
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(
          initialState,
          patchLeaseInvoiceNotes(dummyLease),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true deleting lease", () => {
        const dummyLease = 1;
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, deleteLease(dummyLease));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true by copyDecisionToLeases", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(
          initialState,
          copyDecisionToLeases({ test: 1 }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when starting invoicing", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, startInvoicing(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when stoping invoicing", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, stopInvoicing(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when setting rent info complete", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, setRentInfoComplete(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when setting rent info uncomplete", () => {
        const newState = { ...initialState, isSaving: true };
        const state = leasesReducer(initialState, setRentInfoUncomplete(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...initialState, isEditMode: true };
        const state = leasesReducer(initialState, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...initialState };
        newState.isEditMode = false;
        let state = leasesReducer(initialState, showEditMode());
        state = leasesReducer(initialState, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isAttachDecisionModalOpen flag to true", () => {
        const newState = { ...initialState, isAttachDecisionModalOpen: true };
        const state = leasesReducer(initialState, showAttachDecisionModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isAttachDecisionModalOpen flag to false", () => {
        const newState = { ...initialState };
        newState.isAttachDecisionModalOpen = false;
        let state = leasesReducer(initialState, showAttachDecisionModal());
        state = leasesReducer(initialState, hideAttachDecisionModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateModalOpen flag to true", () => {
        const newState = { ...initialState, isCreateModalOpen: true };
        const state = leasesReducer(initialState, showCreateModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateModalOpen flag to false", () => {
        const newState = { ...initialState, isCreateModalOpen: false };
        let state = leasesReducer(initialState, showCreateModal());
        state = leasesReducer(initialState, hideCreateModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingById flag to true when fetching lease by id", () => {
        const leaseId = 1;
        const newState = {
          ...initialState,
          isFetchingById: {
            [leaseId]: true,
          },
        };
        const state = leasesReducer(initialState, fetchLeaseById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingById flag to false by notFoundByLease", () => {
        const leaseId = 1;
        const newState = {
          ...initialState,
          isFetchingById: {
            [leaseId]: false,
          },
        };
        const state = leasesReducer(initialState, notFoundById(leaseId));
        expect(state).to.deep.equal(newState);
      });
      it("should update leaseById when receiving lease by id", () => {
        const leaseId = 1;
        const newState = {
          ...initialState,
          byId: {
            [leaseId]: dummyLease,
          },
          isFetchingById: {
            [leaseId]: false,
          },
        };
        const state = leasesReducer(
          initialState,
          receiveLeaseById({
            leaseId: leaseId,
            lease: dummyLease,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...initialState, isSaveClicked: true };
        const state = leasesReducer(initialState, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateClicked", () => {
        const newState = { ...initialState, isCreateClicked: true };
        const state = leasesReducer(initialState, receiveIsCreateClicked(true));
        expect(state).to.deep.equal(newState);
      });
      it("createCharge should not change state", () => {
        const newState = { ...initialState };
        const state = leasesReducer(
          initialState,
          createCharge({
            data: initialState,
            leaseId: 1,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingLeasesForContractNumbers flag to true when fetching leases for contract numbers", () => {
        const newState = {
          ...initialState,
          isFetchingLeasesForContractNumbers: true,
        };
        const state = leasesReducer(
          initialState,
          fetchLeasesForContractNumbers({ test: "" }),
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
        const newState = { ...initialState };
        newState.leasesForContractNumbers = dummyLeaseList;
        const state = leasesReducer(
          initialState,
          receiveLeasesForContractNumbers(dummyLeaseList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update collapseStates", () => {
        const newState = {
          ...initialState,
          collapseStates: {
            foo: "bar",
            foo2: "bar2",
          },
        };
        let state = leasesReducer(
          initialState,
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
      it("should update isFetchingLeasesForContact flag to true when fetching leases for contact", () => {
        const newState = {
          ...initialState,
          isFetchingLeasesForContact: true,
        };
        const state = leasesReducer(
          initialState,
          fetchLeasesForContact({ test: "" }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update leasesForContact", () => {
        const dummyLeaseList = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = { ...initialState };
        newState.leasesForContact = dummyLeaseList;
        const state = leasesReducer(
          initialState,
          receiveLeasesForContact(dummyLeaseList),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingLeasesForContactAttributes flag to true when fetching leases for contact attributes", () => {
        const newState = {
          ...initialState,
          isFetchingLeasesForContactAttributes: true,
        };
        const state = leasesReducer(
          initialState,
          fetchLeasesForContactAttributes(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update leasesForContactAttributes", () => {
        const dummyAttributes = {
          foo: "bar",
        };
        const newState = { ...initialState };
        newState.leasesForContactAttributes = dummyAttributes;
        const state = leasesReducer(
          initialState,
          receiveLeasesForContactAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
