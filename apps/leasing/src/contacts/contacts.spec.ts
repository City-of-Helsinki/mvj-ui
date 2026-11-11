import { describe, expect, it } from "vitest";
import contactReducer, {
  initialState,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveSingleContact,
  initializeContactForm,
  receiveContactFormValid,
  showEditMode,
  hideEditMode,
  showContactModal,
  hideContactModal,
  receiveContactModalSettings,
  receiveContacts,
  fetchContacts,
  fetchSingleContact,
  createContact,
  editContact,
  createContactOnModal,
  editContactOnModal,
  notFound,
  receiveIsSaveClicked,
} from "@/contacts/slice";
import type { Contact } from "@/contacts/types";
import type { ServiceUnit } from "@/serviceUnits/types";

describe("Contacts", () => {
  describe("Reducer", () => {
    describe("contactReducer", () => {
      it("should set isFetchingAttributes flag to true when fething attributes", () => {
        const newState = { ...initialState, isFetchingAttributes: true };
        const state = contactReducer(initialState, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes flag to false by attributeNotFound", () => {
        const newState = { ...initialState, isFetchingAttributes: false };
        let state = contactReducer(initialState, fetchAttributes());
        state = contactReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update contact attributes", () => {
        const dummyAttributes = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = {
          ...initialState,
          isFetchingAttributes: false,
          attributes: dummyAttributes,
        };
        const state = contactReducer(
          initialState,
          receiveAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update contact methods", () => {
        const dummyMethods = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = {
          ...initialState,
          isFetchingAttributes: false,
          methods: dummyMethods,
        };
        const state = contactReducer(
          initialState,
          receiveMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching contacts", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = contactReducer(initialState, fetchContacts({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update contacts list", () => {
        const dummyContactsList = [
          {
            id: 1,
            label: "Foo",
            name: "Bar",
          },
          {
            id: 2,
            label: "Foo",
            name: "Bar",
          },
        ];
        const newState = { ...initialState };
        newState.list = {
          results: dummyContactsList,
        };
        const state = contactReducer(
          initialState,
          receiveContacts({
            results: dummyContactsList,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single contact", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = contactReducer(initialState, fetchSingleContact(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update current contact", () => {
        const dummyContact: Contact = {
          id: 1,
          service_unit: {} as ServiceUnit,
          type: "person",
          last_name: "Foo",
          first_name: "Bar",
        };
        const newState = { ...initialState };
        newState.currentContact = dummyContact;
        const state = contactReducer(
          initialState,
          receiveSingleContact(dummyContact),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by createContact", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = contactReducer(
          initialState,
          createContact({} as Contact),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by editContact", () => {
        const newState = { ...initialState };
        newState.isSaving = true;
        const state = contactReducer(initialState, editContact({} as Contact));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by createContactOnModal", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = contactReducer(
          initialState,
          createContactOnModal({} as Contact),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by editContactOnModal", () => {
        const newState = { ...initialState };
        newState.isFetching = true;
        const state = contactReducer(
          initialState,
          editContactOnModal({} as Contact),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState };
        newState.isFetching = false;
        const state = contactReducer(initialState, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update contact form initial values", () => {
        const dummyContact = {
          id: 1,
        };
        const newState = { ...initialState };
        newState.initialContactFormValues = dummyContact;
        const state = contactReducer(
          initialState,
          initializeContactForm(dummyContact),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactFormValid flag to true", () => {
        const newState = { ...initialState };
        newState.isContactFormValid = true;
        const state = contactReducer(
          initialState,
          receiveContactFormValid(true),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...initialState };
        newState.isEditMode = true;
        const state = contactReducer(initialState, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...initialState };
        newState.isEditMode = false;
        const state = contactReducer(initialState, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactModalOpen flag to true", () => {
        const newState = { ...initialState };
        newState.isContactModalOpen = true;
        const state = contactReducer(initialState, showContactModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactModalOpen flag to false", () => {
        const newState = { ...initialState };
        newState.isContactModalOpen = false;
        let state = contactReducer(initialState, showContactModal());
        state = contactReducer(state, hideContactModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update contactModalSettings", () => {
        const dummySettings = {
          foo: "bar",
        };
        const newState = { ...initialState };
        newState.contactModalSettings = dummySettings;
        const state = contactReducer(
          initialState,
          receiveContactModalSettings(dummySettings),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...initialState };
        newState.isSaveClicked = true;
        const state = contactReducer(initialState, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });

    describe("Edge cases with empty or null values", () => {
      it("should handle null attributes", () => {
        const state = contactReducer(initialState, receiveAttributes(null));
        expect(state.attributes).to.be.null;
      });

      it("should handle empty contact list", () => {
        const state = contactReducer(
          initialState,
          receiveContacts({ results: [] }),
        );
        expect(state.list.results).to.have.lengthOf(0);
      });
    });

    describe("State transitions", () => {
      it("should transition from fetching to received attributes state", () => {
        let state = contactReducer(initialState, fetchAttributes());
        expect(state.isFetchingAttributes).to.be.true;

        state = contactReducer(state, receiveAttributes({ test: "data" }));
        expect(state.isFetchingAttributes).to.be.false;
        expect(state.attributes).to.not.be.null;
      });

      it("should handle complete modal lifecycle", () => {
        let state = contactReducer(initialState, showContactModal());
        expect(state.isContactModalOpen).to.be.true;

        state = contactReducer(
          state,
          receiveContactModalSettings({ foo: "bar" }),
        );
        expect(state.contactModalSettings).to.not.be.null;

        state = contactReducer(state, hideContactModal());
        expect(state.isContactModalOpen).to.be.false;
      });

      it("should handle contact form validation flow", () => {
        const dummyContact = { id: 1, name: "Test" };
        let state = contactReducer(
          initialState,
          initializeContactForm(dummyContact),
        );
        expect(state.initialContactFormValues).to.deep.equal(dummyContact);

        state = contactReducer(state, receiveContactFormValid(true));
        expect(state.isContactFormValid).to.be.true;
      });
    });
  });
});
