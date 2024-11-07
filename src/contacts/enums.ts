/**
 * Contact type enumerable.
 * @readonly
 * @enum {string}
 */
export const ContactTypes = {
  PERSON: 'person',
  BUSINESS: 'business',
  UNIT: 'unit',
  ASSOCIATION: 'association',
  OTHER: 'other'
};

/**
 * Contact field paths enumerable.
 * @readonly
 * @enum {string}
 */
export const ContactFieldPaths = {
  ACTIVE_LEASES: 'contacts_active_leases',
  ADDRESS: 'address',
  ADDRESS_PROTECTION: 'address_protection',
  AUDIT_LOG: 'audit_log',
  BASIC_INFO: 'basic_info',
  BUSINESS_ID: 'business_id',
  CARE_OF: 'care_of',
  CITY: 'city',
  COUNTRY: 'country',
  CREDIT_DECISION: 'creditDecision',
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
  SERVICE_UNIT: 'service_unit',
  TRADE_REGISTER: 'trade_register',
  TYPE: 'type'
};

/**
 * Contact field titles enumerable.
 * @readonly
 * @enum {string}
 */
export const ContactFieldTitles = {
  ACTIVE_LEASES: 'Vuokraukset',
  ADDRESS: 'Katuosoite',
  ADDRESS_PROTECTION: 'Turvakielto',
  AUDIT_LOG: 'Muutoshistoria',
  BASIC_INFO: 'Perustiedot',
  BUSINESS_ID: 'Y-tunnus',
  CARE_OF: 'c/o',
  CITY: 'Postitoimipaikka',
  COUNTRY: 'Maa',
  CREDIT_DECISION: 'Asiakastieto',
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
  SERVICE_UNIT: 'Palvelukokonaisuus',
  TRADE_REGISTER: 'Kaupparekisteri',
  TYPE: 'Asiakastyyppi'
};