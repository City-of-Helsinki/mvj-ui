import type { Action, Attributes, Methods } from "@/types";
import { ContactTypes } from "@/contacts/enums";
import { ServiceUnit } from "@/serviceUnits/types";
export type ContactState = {
  attributes: Attributes;
  contactModalSettings: ContactModalSettings;
  currentContact: Contact;
  initialContactFormValues: Contact;
  isContactFormValid: boolean;
  isContactModalOpen: boolean;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  list: ContactList;
  methods: Methods;
};
export type ContactExistsResponse = {
  exists: boolean;
};
export type Contact = {
  service_unit: ServiceUnit;
  type: (typeof ContactTypes)[keyof typeof ContactTypes];
  business_id?: string;
  language?: string;
  sap_customer_number?: string;
  partner_code?: string;
  electronic_billing_address?: string;
  note?: string;
  national_identification_number?: string;
  name?: string;
  care_of?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  is_lessor?: boolean;
};
export type ContactId = number;
export type ContactList = any;
export type ContactModalSettings = Record<string, any> | null;
export type ContactNotFoundAction = Action<string, void>;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type ContactAttributesNotFoundAction = Action<string, void>;
export type CreateContactAction = Action<string, Contact>;
export type EditContactAction = Action<string, Contact>;
export type CreateContactOnModalAction = Action<string, Contact>;
export type EditContactOnModalAction = Action<string, Contact>;
export type FetchContactsAction = Action<string, Record<string, any>>;
export type ReceiveContactsAction = Action<string, ContactList>;
export type FetchSingleContactAction = Action<string, ContactId>;
export type ReceiveSingleContactAction = Action<string, Contact>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type InitializeContactFormValuesAction = Action<string, Contact>;
export type ReceiveContactFormValidAction = Action<string, boolean>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type HideContactModalAction = Action<string, void>;
export type ShowContactModalAction = Action<string, void>;
export type ReceiveContactModalSettingsAction = Action<
  string,
  ContactModalSettings
>;
export type ContactsActiveLease = {
  lease_id: number;
  lease_identifier: string;
};
export type ContactRow = {
  contacts_active_leases?: Array<ContactsActiveLease>;
};
export type SetTabDirtyFunction = (tabId: number, isDirty: boolean) => void;
