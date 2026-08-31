import { describe, expect, it } from "vitest";
import invoiceReducer, {
  receiveAttributes,
  receiveMethods,
  fetchAttributes,
  attributesNotFound,
  receiveInvoicesByLease,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  receiveIsCreateClicked,
  receiveIsCreditClicked,
  receiveIsEditClicked,
  fetchInvoicesByLease,
  createInvoice,
  patchInvoice,
  exportInvoiceToLaskeAndUpdateList,
  receivePatchedInvoice,
  clearPatchedInvoice,
  notFound,
  receiveInvoiceToCredit,
  creditInvoice,
  deleteInvoice,
  initialState,
} from "./slice";

describe("Invoices", () => {
  describe("Reducer", () => {
    describe("invoiceReducer", () => {
      it("should update attributes", () => {
        const dummyAttributes = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = { ...initialState, attributes: dummyAttributes };
        const state = invoiceReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update methods", () => {
        const dummyMethods = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = { ...initialState, methods: dummyMethods };
        const state = invoiceReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes flag to true when fetching attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = invoiceReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes flag to false by attributesNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = invoiceReducer(initialState, fetchAttributes());
        state = invoiceReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update invoices received by lease", () => {
        const dummyInvoices = [
          {
            id: 1,
            label: "Foo",
          },
        ];
        const newState = {
          ...initialState,
          byLease: {
            "1": dummyInvoices,
          },
        };
        const state = invoiceReducer(
          initialState,
          receiveInvoicesByLease({
            leaseId: 1,
            invoices: dummyInvoices,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreatePanelOpen flag to true", () => {
        const isCreatePanelOpen = true;
        const newState = {
          ...initialState,
          isCreatePanelOpen: isCreatePanelOpen,
        };
        const state = invoiceReducer(
          initialState,
          receiveIsCreateInvoicePanelOpen(isCreatePanelOpen),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateClicked flag to true", () => {
        const isCreateClicked = true;
        const newState = { ...initialState, isCreateClicked: isCreateClicked };
        const state = invoiceReducer(
          initialState,
          receiveIsCreateClicked(isCreateClicked),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreditClicked flag to true", () => {
        const isCreditClicked = true;
        const newState = { ...initialState, isCreditClicked: isCreditClicked };
        const state = invoiceReducer(
          initialState,
          receiveIsCreditClicked(isCreditClicked),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditClicked flag to true", () => {
        const isEditClicked = true;
        const newState = { ...initialState, isEditClicked: isEditClicked };
        const state = invoiceReducer(
          initialState,
          receiveIsEditClicked(isEditClicked),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isCreateCreditOpen flag to true", () => {
        const isCreditPanelOpen = true;
        const newState = {
          ...initialState,
          isCreditPanelOpen: isCreditPanelOpen,
        };
        const state = invoiceReducer(
          initialState,
          receiveIsCreditInvoicePanelOpen(isCreditPanelOpen),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching invoices", () => {
        const newState = { ...initialState, isFetching: true };
        const state = invoiceReducer(initialState, fetchInvoicesByLease(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when creating invoice", () => {
        const newState = { ...initialState, isFetching: true };
        const state = invoiceReducer(initialState, createInvoice(initialState));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when patching invoice", () => {
        const newState = { ...initialState, isSaving: true };
        const state = invoiceReducer(initialState, patchInvoice(initialState));
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaving flag to true when exporting invoice to laske", () => {
        const newState = { ...initialState, isSaving: true };
        const state = invoiceReducer(
          initialState,
          exportInvoiceToLaskeAndUpdateList({
            id: 1,
            lease: 1,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should delete isSaving flag to true when deleting invoice", () => {
        const newState = { ...initialState, isSaving: true };
        const state = invoiceReducer(
          initialState,
          deleteInvoice({
            invoice: "Invoice",
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        const state = invoiceReducer(initialState, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update patchedInvoice", () => {
        const dummyInvoice = {
          foo: "bar",
        };
        const newState = { ...initialState, patchedInvoice: dummyInvoice };
        const state = invoiceReducer(
          initialState,
          receivePatchedInvoice(dummyInvoice),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should clear patchedInvoice", () => {
        const dummyInvoice = {
          foo: "bar",
        };
        const newState = { ...initialState, patchedInvoice: null };
        let state = invoiceReducer(
          initialState,
          receivePatchedInvoice(dummyInvoice),
        );
        state = invoiceReducer(state, clearPatchedInvoice());
        expect(state).to.deep.equal(newState);
      });
      it("should update invoiceToCredit", () => {
        const dummyInvoice = { foo: "bar" };
        const newState = { ...initialState, invoiceToCredit: dummyInvoice };
        const state = invoiceReducer(
          initialState,
          receiveInvoiceToCredit(dummyInvoice),
        );
        expect(state).to.deep.equal(newState);
      });
      it("creditInvoice should not change state", () => {
        const state = invoiceReducer(initialState, creditInvoice(initialState));
        expect(state).to.deep.equal(initialState);
      });
    });
  });
});
