import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ContactAttributesNotFoundAction,
  Contact,
  ContactId,
  ContactList,
  ContactModalSettings,
  ContactNotFoundAction,
  CreateContactAction,
  EditContactAction,
  CreateContactOnModalAction,
  EditContactOnModalAction,
  InitializeContactFormValuesAction,
  FetchContactsAction,
  ReceiveContactsAction,
  FetchSingleContactAction,
  ReceiveSingleContactAction,
  ReceiveIsSaveClickedAction,
  ReceiveContactFormValidAction,
  HideEditModeAction,
  ShowEditModeAction,
  HideContactModalAction,
  ShowContactModalAction,
  ReceiveContactModalSettingsAction,
} from "./types";
export const notFound = (): ContactNotFoundAction =>
  createAction("mvj/contacts/NOT_FOUND")();
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/contacts/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/contacts/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/contacts/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): ContactAttributesNotFoundAction =>
  createAction("mvj/contacts/ATTRIBUTES_NOT_FOUND")();
export const createContact = (contact: Contact): CreateContactAction =>
  createAction("mvj/contacts/CREATE")(contact);
export const editContact = (contact: Contact): EditContactAction =>
  createAction("mvj/contacts/EDIT")(contact);
export const createContactOnModal = (
  contact: Contact,
): CreateContactOnModalAction =>
  createAction("mvj/contacts/CREATE_ON_MODAL")(contact);
export const editContactOnModal = (
  contact: Contact,
): EditContactOnModalAction =>
  createAction("mvj/contacts/EDIT_ON_MODAL")(contact);
export const fetchContacts = (
  params: Record<string, any>,
): FetchContactsAction => createAction("mvj/contacts/FETCH_ALL")(params);
export const receiveContacts = (contacts: ContactList): ReceiveContactsAction =>
  createAction("mvj/contacts/RECEIVE_ALL")(contacts);
export const fetchSingleContact = (
  contactId: ContactId,
): FetchSingleContactAction =>
  createAction("mvj/contacts/FETCH_SINGLE")(contactId);
export const receiveSingleContact = (
  contact: Contact,
): ReceiveSingleContactAction =>
  createAction("mvj/contacts/RECEIVE_SINGLE")(contact);
export const initializeContactForm = (
  contact: Contact,
): InitializeContactFormValuesAction =>
  createAction("mvj/contacts/INITIALIZE_FORM")(contact);
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/contacts/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveContactFormValid = (
  valid: boolean,
): ReceiveContactFormValidAction =>
  createAction("mvj/contacts/RECEIVE_CONTACT_FORM_VALID")(valid);
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/contacts/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/contacts/SHOW_EDIT")();
export const hideContactModal = (): HideContactModalAction =>
  createAction("mvj/contacts/HIDE_CONTACT_MODAL")();
export const showContactModal = (): ShowContactModalAction =>
  createAction("mvj/contacts/SHOW_CONTACT_MODAL")();
export const receiveContactModalSettings = (
  settings: ContactModalSettings,
): ReceiveContactModalSettingsAction =>
  createAction("mvj/contacts/RECEIVE_CONTACT_SETTINGS")(settings);
