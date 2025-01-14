import { isDirty } from "redux-form";
import { FormNames, TableSortOrder } from "@/enums";
import { ContactTypes } from "./enums";
import { getIsEditMode } from "@/contacts/selectors";
import { removeSessionStorageItem } from "@/util/storage";

/**
 * Get full name of contact
 * @param {Object} contact
 * @returns {string}
 */
export const getContactFullName = (
  contact: Record<string, any> | null | undefined,
): string => {
  if (!contact || !contact.type) return "";
  return contact.type === ContactTypes.PERSON
    ? `${contact.last_name ? `${contact.last_name} ` : ""} ${contact.first_name || ""}`.trim()
    : contact.name;
};

/**
 * Get Contact business id field errors
 * @param {string} businessId
 * @returns {boolean}
 */
export const getContactBusinessIdFieldError = (
  businessId: string | null | undefined,
): boolean => {
  return businessId && businessId.length === 9 ? false : true;
};

/**
 * Get Contact business id field errors
 * @param {Object} contact
 * @returns {boolean}
 */
export const getContactBusinessIdError = (
  contact: Record<string, any>,
): boolean => {
  return contact.business_id && contact.business_id.length === 9 ? false : true;
};

/**
 * Get contact content
 * @param {Object} contact
 * @returns {Object}
 */
export const getContentContact = (
  contact: Record<string, any>,
): Record<string, any> => {
  return {
    id: contact.id,
    value: contact.id,
    label: `${getContactFullName(contact)}${contact.care_of ? ` c/o ${contact.care_of}` : ""}`,
    type: contact.type,
    first_name: contact.first_name,
    last_name: contact.last_name,
    name: contact.name,
    business_id: contact.business_id,
    address: contact.address,
    postal_code: contact.postal_code,
    city: contact.city,
    care_of: contact.care_of,
    email: contact.email,
    phone: contact.phone,
    language: contact.language,
    national_identification_number: contact.national_identification_number,
    address_protection: contact.address_protection,
    customer_number: contact.customer_number,
    sap_customer_number: contact.sap_customer_number,
    electronic_billing_address: contact.electronic_billing_address,
    partner_code: contact.partner_code,
    is_lessor: contact.is_lessor,
    note: contact.note,
    service_unit: contact.service_unit,
  };
};

/**
 * Get contact options from contact list
 * @param {Object[]} contacts
 * @returns {Object[]}
 */
export const getContactOptions = (
  contacts: Array<Record<string, any>>,
): Array<Record<string, any>> =>
  contacts && contacts.length
    ? contacts.map((contact) => ({
        value: contact.id,
        label: `${getContactFullName(contact)}${contact.care_of ? ` c/o ${contact.care_of}` : ""}`,
      }))
    : [];

/**
 * Map contact search filters for API
 * @param {Object} query
 * @returns {Object}
 */
export const mapContactSearchFilters = (
  query: Record<string, any>,
): Record<string, any> => {
  const searchQuery = { ...query };

  if (searchQuery.sort_key) {
    if (searchQuery.sort_key === "names") {
      searchQuery.ordering = ["names", "first_name"];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

/**
 * Test is contact form dirty
 * @param {Object} state
 * @returns {boolean}
 */
export const isContactFormDirty = (state: any): boolean => {
  const isEditMode = getIsEditMode(state);
  return isEditMode && isDirty(FormNames.CONTACT)(state);
};

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.CONTACT);
  removeSessionStorageItem("contactId");
};
