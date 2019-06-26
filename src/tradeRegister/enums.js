// @flow

/**
 * Company states enumerable
 * @readonly
 * @enum {string}
 */
export const CompanyStates = {
  L: 'Lakannut',
  R: 'Rekisterissä',
};

/**
 * Collapse state paths enumerable
 * @readonly
 * @enum {string}
 */
export const CollapseStatePaths = {
  COMPANY_EXTENDED: 'company_extended',
  COMPANY_NOTICE: 'company_notice',
  COMPANY_REPRESENT: 'company_represent',
  DOWNLOADABLE_FILES: 'downloadable_files',
};

/**
 * Company extended field paths
 * @readonly
 * @enum {string}
 */
export const CompanyExtendedFieldPaths = {
  AUXILIARY_COMPANY_NAMES: 'auxiliaryCompanyName',
  AUXILIARY_COMPANY_NAMES_NAME: 'auxiliaryCompanyName.name',
  AUXILIARY_COMPANY_NAMES_LINE_OF_BUSINESS: 'auxiliaryCompanyName.lineOfBusiness',
  AUXILIARY_COMPANY_NAMES_EXPIRATION_DATE: 'auxiliaryCompanyName.expirationDate',
  AUXILIARY_COMPANY_NAMES_REGISTRATION_DATE: 'auxiliaryCompanyName.registrationDate',
  BUSINESS_ID: 'businessId',
  COMPANY_EXTENDED: 'companyExtended',
  COMPANY_NAME: 'companyName',
  COMPANY_NAME_NAME: 'companyName.name',
  COMPANY_NAME_EXPIRATION_DATE: 'companyName.expidationDate',
  COMPANY_NAME_REGISTRATION_DATE: 'companyName.registrationDate',
  CONTACT_INFORMATION: 'contactInformation',
  CONTACT_INFORMATION_EMAIL: 'contactInformation.email',
  CONTACT_INFORMATION_FAX: 'contactInformation.fax.number',
  CONTACT_INFORMATION_HOMEPAGE: 'contactInformation.homepage',
  CONTACT_INFORMATION_PHONE: 'contactInformation.phone.number',
  CONTACT_INFORMATION_POSTAL: 'contactInformation.postal',
  CONTACT_INFORMATION_POSTAL_CITY: 'contactInformation.postal.city',
  CONTACT_INFORMATION_POSTAL_CO: 'contactInformation.postal.co',
  CONTACT_INFORMATION_POSTAL_COUNTRY: 'contactInformation.postal.country',
  CONTACT_INFORMATION_POSTAL_STREET_ADDRESS: 'contactInformation.postal.streetAddress',
  CONTACT_INFORMATION_POSTAL_ZIP_CODE: 'contactInformation.postal.zipCode',
  CONTACT_INFORMATION_VISITATION: 'contactInformation.visitation',
  CONTACT_INFORMATION_VISITATION_CITY: 'contactInformation.visitation.city',
  CONTACT_INFORMATION_VISITATION_CO: 'contactInformation.visitation.co',
  CONTACT_INFORMATION_VISITATION_COUNTRY: 'contactInformation.visitation.country',
  CONTACT_INFORMATION_VISITATION_STREET_ADDRESS: 'contactInformation.visitation.streetAddress',
  CONTACT_INFORMATION_VISITATION_ZIP_CODE: 'contactInformation.visitation.zipCode',
  DELIVERY_DATE_OF_LAST_FINANCIAL_STATEMENT: 'deliveryDateOfLastFinancialStatement',
  DOMICILE: 'domicile',
  DOMICILE_CODE: 'domicile.code',
  DOMICILE_EXPIRATION_DATE: 'domicile.expidationDate',
  DOMICILE_REGISTRATION_DATE: 'domicile.registrationDate',
  DISSOLUTION_DATE: 'dissolutionDate',
  FORM_TYPE: 'form.type',
  FORM_EXPIRATION_DATE: 'form.expirationDate',
  FORM_REGISTRATION_DATE: 'form.registrationDate',
  HISTORICAL_NAMES: 'companyName.historicalNames',
  HISTORICAL_NAMES_NAME: 'companyName.historicalNames.name',
  HISTORICAL_NAMES_EXPIRATION_DATE: 'companyName.historicalNames.expirationDate',
  HISTORICAL_NAMES_REGISTRATION_DATE: 'companyName.historicalNames.registrationDate',
  LINE_OF_BUSINESS: 'companyName.lineOfBusiness.value',
  PARALLEL_COMPANY_NAMES: 'companyName.parallelCompanyName',
  PARALLEL_COMPANY_NAMES_NAME: 'companyName.parallelCompanyName.name',
  PARALLEL_COMPANY_NAMES_EXPIRATION_DATE: 'companyName.parallelCompanyName.expirationDate',
  PARALLEL_COMPANY_NAMES_REGISTRATION_DATE: 'companyName.parallelCompanyName.registrationDate',
  REGISTRATION_DATE: 'registrationDate',
  REGISTRATION_NUMBER: 'registrationNumber',
  SHARE_CAPITAL: 'shareCapital',
  SHARE_CAPITAL_AMOUNT_OF_SHARES: 'shareCapital.amountOfShares',
  SHARE_CAPITAL_CURRENCY: 'shareCapital.currency',
  SHARE_CAPITAL_EXPIRATION_DATE: 'shareCapital.expirationDate',
  SHARE_CAPITAL_NOMINAL_VALUE: 'shareCapital.nominalValue',
  SHARE_CAPITAL_PAID_VALUE: 'shareCapital.paidValue',
  SHARE_CAPITAL_REGISTARATION_DATE: 'shareCapital.registrationDate',
  SHARE_CAPITAL_VALUE: 'shareCapital.value',
  STATE_TYPE: 'state.type',
  STATE_EXPIRATION_DATE: 'state.expirationDate',
  STATE_REGISTRATION_DATE: 'state.registrationDate',
};

/**
 * Company extended field paths
 * @readonly
 * @enum {string}
 */
export const CompanyExtendedFieldTitles = {
  AUXILIARY_COMPANY_NAMES: 'Aputoiminimet',
  AUXILIARY_COMPANY_NAMES_NAME: 'Yrityksen nimi',
  AUXILIARY_COMPANY_NAMES_LINE_OF_BUSINESS: 'Toimialakuvaus',
  AUXILIARY_COMPANY_NAMES_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  AUXILIARY_COMPANY_NAMES_REGISTRATION_DATE: 'Rekisteröintipvm',
  BUSINESS_ID: 'Y-tunnus',
  COMPANY_EXTENDED: 'Laajennetut perustiedot',
  COMPANY_NAME: 'Nimitiedot',
  COMPANY_NAME_NAME: 'Yrityksen nimi',
  COMPANY_NAME_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  COMPANY_NAME_REGISTRATION_DATE: 'Rekisteröintipvm',
  CONTACT_INFORMATION: 'Yhteystiedot',
  CONTACT_INFORMATION_EMAIL: 'Sähköposti',
  CONTACT_INFORMATION_FAX: 'Faksi',
  CONTACT_INFORMATION_HOMEPAGE: 'Kotisivu',
  CONTACT_INFORMATION_PHONE: 'Puhelin',
  CONTACT_INFORMATION_POSTAL: 'Postiosoite',
  CONTACT_INFORMATION_POSTAL_CITY: 'Kaupunki',
  CONTACT_INFORMATION_POSTAL_CO: 'c/o',
  CONTACT_INFORMATION_POSTAL_COUNTRY: 'Maa',
  CONTACT_INFORMATION_POSTAL_STREET_ADDRESS: 'Katuosoite',
  CONTACT_INFORMATION_POSTAL_ZIP_CODE: 'Postinumero',
  CONTACT_INFORMATION_VISITATION: 'Käyntiosoite',
  CONTACT_INFORMATION_VISITATION_CITY: 'Kaupunki',
  CONTACT_INFORMATION_VISITATION_CO: 'c/o',
  CONTACT_INFORMATION_VISITATION_COUNTRY: 'Maa',
  CONTACT_INFORMATION_VISITATION_STREET_ADDRESS: 'Katuosoite',
  CONTACT_INFORMATION_VISITATION_ZIP_CODE: 'Postinumero',
  DELIVERY_DATE_OF_LAST_FINANCIAL_STATEMENT: 'Viimeisimmön tilinpäätöksen toimittamispvm',
  DISSOLUTION_DATE: 'Lakkaamispvm',
  DOMICILE: 'Kotipaikka',
  DOMICILE_CODE: 'Kotipaikka',
  DOMICILE_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  DOMICILE_REGISTRATION_DATE: 'Rekisteröintipvm',
  FORM_TYPE: 'Yritysmuoto',
  FORM_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  FORM_REGISTRATION_DATE: 'Rekisteröintipvm',
  HISTORICAL_NAMES: 'Entiset nimet',
  HISTORICAL_NAMES_NAME: 'Yrityksen nimi',
  HISTORICAL_NAMES_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  HISTORICAL_NAMES_REGISTRATION_DATE: 'Rekisteröintipvm',
  LINE_OF_BUSINESS: 'Toimialakuvaus',
  PARALLEL_COMPANY_NAMES: 'Rinnakkaistoiminimet',
  PARALLEL_COMPANY_NAMES_NAME: 'Yrityksen nimi',
  PARALLEL_COMPANY_NAMES_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  PARALLEL_COMPANY_NAMES_REGISTRATION_DATE: 'Rekisteröintipvm',
  REGISTRATION_DATE: 'Rekisteröintipvm',
  REGISTRATION_NUMBER: 'Kaupparekisterinumero',
  SHARE_CAPITAL: 'Osakepääoma',
  SHARE_CAPITAL_AMOUNT_OF_SHARES: 'Osakkeiden lukumäärä',
  SHARE_CAPITAL_CURRENCY: 'Valuutta',
  SHARE_CAPITAL_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  SHARE_CAPITAL_NOMINAL_VALUE: 'Nimellisarvo',
  SHARE_CAPITAL_PAID_VALUE: 'Maksettu',
  SHARE_CAPITAL_REGISTARATION_DATE: 'Rekisteröintipvm',
  SHARE_CAPITAL_VALUE: 'Osakepääoma',
  STATE_TYPE: 'Yrityksen tila',
  STATE_EXPIRATION_DATE: 'Voimassaolon päättymispvm',
  STATE_REGISTRATION_DATE: 'Rekisteröintipvm',
};

/**
 * Company notice field paths
 * @readonly
 * @enum {string}
 */
export const CompanyNoticeFieldPaths = {
  NOTICE: 'notice',
  NOTICE_ARRIVAL_DATE: 'notice.arrivalDate',
  NOTICE_LATEST_PHASE_NAME: 'notice.latestPhaseName',
  NOTICE_LATEST_PHASE_ARRIVAL_DATE: 'notice.latestPhaseArrivalDate',
  NOTICE_RECORD_NUMBER: 'notice.recordNumber',
  NOTICE_TYPE: 'notice.type',
};

/**
 * Company notice field paths
 * @readonly
 * @enum {string}
 */
export const CompanyNoticeFieldTitles = {
  NOTICE: 'Vireillä olevat ilmoitukset',
  NOTICE_ARRIVAL_DATE: 'Saapumispvm',
  NOTICE_LATEST_PHASE_NAME: 'Viimeisen vaiheen tyyppi',
  NOTICE_LATEST_PHASE_ARRIVAL_DATE: 'Viimeisen vaiheen alkupvm',
  NOTICE_RECORD_NUMBER: 'Diaarinumero',
  NOTICE_TYPE: 'Tyyppi',
};

/**
 * Company represent field paths
 * @readonly
 * @enum {string}
 */
export const CompanyRepresentFieldPaths = {
  BODY: 'body',
  BODY_TYPE: 'body.type',
  BODY_VALUE_1: 'body._value_1',
  BODY_VALUE_1_NATURAL_PERSON: 'body._value_1.naturalPerson',
  BODY_VALUE_1_NATURAL_PERSON_DATE_OF_BIRTH: 'body._value_1.naturalPerson.dateOfBirth',
  BODY_VALUE_1_NATURAL_PERSON_FIRSTNAME: 'body._value_1.naturalPerson.firstname',
  BODY_VALUE_1_NATURAL_PERSON_ROLE: 'body._value_1.naturalPerson.role',
  BODY_VALUE_1_NATURAL_PERSON_SURNAME: 'body._value_1.naturalPerson.surname',
  BODY_VALUE_1_JURISTIC_PERSON: 'body._value_1.juristicPerson',
  BODY_VALUE_1_JURISTIC_PERSON_BUSINESS_ID: 'body._value_1.juristicPerson.businessId',
  BODY_VALUE_1_JURISTIC_PERSON_NAME: 'body._value_1.juristicPerson.name',
  BODY_VALUE_1_JURISTIC_PERSON_REGISTER: 'body._value_1.juristicPerson.register',
  BODY_VALUE_1_JURISTIC_PERSON_REGISTRATION_NUMBER: 'body._value_1.juristicPerson.registrationNumber',
  BODY_VALUE_1_JURISTIC_PERSON_ROLE: 'body._value_1.juristicPerson.role',
  LEGAL_REPRESENTATION: 'legalRepresentation',
  LEGAL_REPRESENTATION_EXPIRE_DATE: 'legalRepresentation.expireDate',
  LEGAL_REPRESENTATION_HEADER: 'legalRepresentation.header',
  LEGAL_REPRESENTATION_REGISTRATION_DATE: 'legalRepresentation.registrationDate',
  LEGAL_REPRESENTATION_SIGNING_CODE: 'legalRepresentation.signingCode',
  LEGAL_REPRESENTATION_TEXT: 'legalRepresentation.text',
  REPRESENT_TITLE: 'represent_title',
  REPRESENTATION: 'representation',
  REPRESENTATION_ADDITIONAL_GROUP: 'representation.additionalGroup',
  REPRESENTATION_RULE: 'representation.rule',
};

/**
 * Company represent field paths
 * @readonly
 * @enum {string}
 */
export const CompanyRepresentFieldTitles = {
  BODY: 'Päättäjätiedot',
  BODY_TYPE: 'Tyyppi',
  BODY_VALUE_1: 'Henkilöt',
  BODY_VALUE_1_NATURAL_PERSON: 'Luonnollinen henkilö',
  BODY_VALUE_1_NATURAL_PERSON_DATE_OF_BIRTH: 'Syntynäaika',
  BODY_VALUE_1_NATURAL_PERSON_FIRSTNAME: 'Etunimi',
  BODY_VALUE_1_NATURAL_PERSON_ROLE: 'Rooli',
  BODY_VALUE_1_NATURAL_PERSON_SURNAME: 'Sukunimi',
  BODY_VALUE_1_JURISTIC_PERSON: 'Juridinen henkilö',
  BODY_VALUE_1_JURISTIC_PERSON_BUSINESS_ID: 'Y-tunnus',
  BODY_VALUE_1_JURISTIC_PERSON_NAME: 'Nimi',
  BODY_VALUE_1_JURISTIC_PERSON_REGISTER: 'Rekisteritunniste',
  BODY_VALUE_1_JURISTIC_PERSON_REGISTRATION_NUMBER: 'Rekisterinumero',
  BODY_VALUE_1_JURISTIC_PERSON_ROLE: 'Rooli',
  LEGAL_REPRESENTATION: 'Edustamislausekkeet',
  LEGAL_REPRESENTATION_EXPIRE_DATE: 'Voimassaolon päättymispvm',
  LEGAL_REPRESENTATION_HEADER: 'Otsikko',
  LEGAL_REPRESENTATION_REGISTRATION_DATE: 'Rekisteröintipvm',
  LEGAL_REPRESENTATION_SIGNING_CODE: 'Nimenkirjoituskoodi',
  LEGAL_REPRESENTATION_TEXT: 'Rekisterimerkintä',
  REPRESENT_TITLE: 'Edustamistiedot',
  REPRESENTATION: 'Edustamistiedot',
  REPRESENTATION_ADDITIONAL_GROUP: 'Toinen ryhmä',
  REPRESENTATION_RULE: 'Nimenkirjoitustapa',
};
