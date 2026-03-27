import { describe, expect, it } from "vitest";
import {
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
} from "./actions";
import contactReducer from "./reducer";
import type { ContactState } from "./types";
const defaultState: ContactState = {
  attributes: null,
  contactModalSettings: null,
  currentContact: {},
  initialContactFormValues: {
    decisions: [""],
    prices: [{}],
    real_estate_ids: [""],
  },
  isContactFormValid: false,
  isContactModalOpen: false,
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  isSaving: false,
  list: {},
  methods: null,
};

describe("Contacts", () => {
  describe("Reducer", () => {
    describe("contactReducer", () => {
      it("should set isFetchingAttributes flag to true when fething attributes", () => {
        const newState = { ...defaultState, isFetchingAttributes: true };
        const state = contactReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should set isFetchingAttributes flag to false by attributeNotFound", () => {
        const newState = { ...defaultState, isFetchingAttributes: false };
        let state = contactReducer({}, fetchAttributes());
        state = contactReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update contact attributes", () => {
        const dummyAttributes = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = {
          ...defaultState,
          isFetchingAttributes: false,
          attributes: dummyAttributes,
        };
        const state = contactReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it("should update contact methods", () => {
        const dummyMethods = {
          val1: "Foo",
          val2: "Bar",
        };
        const newState = {
          ...defaultState,
          isFetchingAttributes: false,
          methods: dummyMethods,
        };
        const state = contactReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching contacts", () => {
        const newState = { ...defaultState };
        newState.isFetching = true;
        const state = contactReducer({}, fetchContacts({}));
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
        const newState = { ...defaultState };
        newState.list = {
          results: dummyContactsList,
        };
        const state = contactReducer(
          {},
          receiveContacts({
            results: dummyContactsList,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching single contact", () => {
        const newState = { ...defaultState };
        newState.isFetching = true;
        const state = contactReducer({}, fetchSingleContact(1));
        expect(state).to.deep.equal(newState);
      });
      it("should update current contact", () => {
        const dummyContact = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...defaultState };
        newState.currentContact = dummyContact;
        const state = contactReducer({}, receiveSingleContact(dummyContact));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by createContact", () => {
        const newState = { ...defaultState };
        newState.isFetching = true;
        const state = contactReducer({}, createContact({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by editContact", () => {
        const newState = { ...defaultState };
        newState.isSaving = true;
        const state = contactReducer({}, editContact({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by createContactOnModal", () => {
        const newState = { ...defaultState };
        newState.isFetching = true;
        const state = contactReducer({}, createContactOnModal({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true by editContactOnModal", () => {
        const newState = { ...defaultState };
        newState.isFetching = true;
        const state = contactReducer({}, editContactOnModal({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...defaultState };
        newState.isFetching = false;
        const state = contactReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
      it("should update contact form initial values", () => {
        const dummyContact = {
          id: 1,
          decision: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
          real_estate_ids: ["Bar"],
        };
        const newState = { ...defaultState };
        newState.initialContactFormValues = dummyContact;
        const state = contactReducer({}, initializeContactForm(dummyContact));
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactFormValid flag to true", () => {
        const newState = { ...defaultState };
        newState.isContactFormValid = true;
        const state = contactReducer({}, receiveContactFormValid(true));
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to true", () => {
        const newState = { ...defaultState };
        newState.isEditMode = true;
        const state = contactReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isEditMode flag to false", () => {
        const newState = { ...defaultState };
        newState.isEditMode = false;
        const state = contactReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactModalOpen flag to true", () => {
        const newState = { ...defaultState };
        newState.isContactModalOpen = true;
        const state = contactReducer({}, showContactModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update isContactModalOpen flag to false", () => {
        const newState = { ...defaultState };
        newState.isContactModalOpen = false;
        let state = contactReducer({}, showContactModal());
        state = contactReducer({}, hideContactModal());
        expect(state).to.deep.equal(newState);
      });
      it("should update contactModalSettings", () => {
        const dummySettings = {
          foo: "bar",
        };
        const newState = { ...defaultState };
        newState.contactModalSettings = dummySettings;
        const state = contactReducer(
          {},
          receiveContactModalSettings(dummySettings),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isSaveClicked", () => {
        const newState = { ...defaultState };
        newState.isSaveClicked = true;
        const state = contactReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
