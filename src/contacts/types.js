// @flow
import type {Action, Attributes, Methods} from '../types';

export type ContactState = {
  attributes: Attributes,
  contactModalSettings: ContactModalSettings,
  currentContact: Contact,
  initialContactFormValues: Contact,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  isSaveClicked: boolean,
  list: ContactList,
  methods: Methods,
};

export type Contact = Object;
export type ContactId = number;
export type ContactList = Object;
export type ContactModalSettings = Object | null;

export type ContactNotFoundAction = Action<'mvj/contacts/NOT_FOUND', void>;

export type FetchAttributesAction = Action<'mvj/contacts/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/contacts/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/contacts/RECEIVE_METHODS', Methods>;
export type ContactAttributesNotFoundAction = Action<'mvj/contacts/ATTRIBUTES_NOT_FOUND', void>;

export type CreateContactAction = Action<'mvj/contacts/CREATE', Contact>;
export type EditContactAction = Action<'mvj/contacts/EDIT', Contact>;
export type CreateContactOnModalAction = Action<'mvj/contacts/CREATE_ON_MODAL', Contact>;
export type EditContactOnModalAction = Action<'mvj/contacts/EDIT_ON_MODAL', Contact>;

export type FetchContactsAction = Action<'mvj/contacts/FETCH_ALL', string>;
export type ReceiveContactsAction = Action<'mvj/contacts/RECEIVE_ALL', ContactList>;

export type FetchSingleContactAction = Action<'mvj/contacts/FETCH_SINGLE', ContactId>;
export type ReceiveSingleContactAction = Action<'mvj/contacts/RECEIVE_SINGLE', Contact>;

export type ReceiveIsSaveClickedAction = Action<'mvj/contacts/RECEIVE_SAVE_CLICKED', boolean>;

export type InitializeContactFormValuesAction = Action<'mvj/contacts/INITIALIZE_FORM', Contact>;
export type ReceiveContactFormValidAction = Action<'mvj/contacts/RECEIVE_CONTACT_FORM_VALID', boolean>;

export type HideEditModeAction = Action<'mvj/contacts/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/contacts/SHOW_EDIT', void>;

export type HideContactModalAction = Action<'mvj/contacts/HIDE_CONTACT_MODAL', void>;
export type ShowContactModalAction = Action<'mvj/contacts/SHOW_CONTACT_MODAL', void>;
export type ReceiveContactModalSettingsAction = Action<'mvj/contacts/RECEIVE_CONTACT_SETTINGS', ContactModalSettings>;
