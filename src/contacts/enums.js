// @flow
/**
 * Contact type enumerable.
 *
 * @type {{PERSON: string, BUSINESS: string, UNIT: string, ASSOCIATION: string, OTHER: string,}}
 */
export const ContactTypes = {
  PERSON: 'person',
  BUSINESS: 'business',
  UNIT: 'unit',
  ASSOCIATION: 'association',
  OTHER: 'other',
};

/**
 * Contact field paths enumerable.
 *
 * @type {{}}
 */
export const ContactFieldPaths = {
  ADDRESS: 'address',
  ADDRESS_PROTECTION: 'address_protection',
  BUSINESS_ID: 'business_id',
  CARE_OF: 'care_of',
  CITY: 'city',
  COUNTRY: 'country',
  ID: 'id',
  ELECTRONIC_BILLING_ADDRESS: 'electronic_billing_address',
  EMAIL: 'email',
  FIRST_NAME: 'first_name',
  IS_LESSOR: 'is_lessor',
  LANGUAGE: 'language',
  LAST_NAME: 'last_name',
  NAME: 'name',
  NATIONAL_IDENTIFICATION_NUMBER: 'national_identification_number',
  NOTE: 'note',
  PARTNER_CODE: 'partner_code',
  PHONE: 'phone',
  POSTAL_CODE: 'postal_code',
  SAP_CUSTOMER_NUMBER: 'sap_customer_number',
  TYPE: 'type',
};

/**
 * Contact field titles enumerable.
 *
 * @type {{}}
 */
export const ContactFieldTitles = {
  ADDRESS: 'Katuosoite',
  ADDRESS_PROTECTION: 'Turvakielto',
  BUSINESS_ID: 'Y-tunnus',
  CARE_OF: 'c/o',
  CITY: 'Postitoimipaikka',
  COUNTRY: 'Maa',
  ELECTRONIC_BILLING_ADDRESS: 'Ovt-tunnus',
  EMAIL: 'Sähköposti',
  FIRST_NAME: 'Etunimi',
  ID: 'Asiakasnumero',
  IS_LESSOR: 'Vuokranantaja',
  LANGUAGE: 'Kieli',
  LAST_NAME: 'Sukunimi',
  NAME: 'Yrityksen nimi',
  NATIONAL_IDENTIFICATION_NUMBER: 'Henkilötunnus',
  NOTE: 'Huomautus',
  PARTNER_CODE: 'Kumppanikoodi',
  PHONE: 'Puhelinnumero',
  POSTAL_CODE: 'Postinumero',
  SAP_CUSTOMER_NUMBER: 'SAP asiakasnumero',
  TYPE: 'Asiakastyyppi',
};
