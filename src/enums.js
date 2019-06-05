// @flow
import React from 'react';

/**
 * View modes enumerable.
 *
 * @type {{EDIT: string, READONLY: string,}}
 */
export const ViewModes = {
  EDIT: 'edit',
  READONLY: 'readonly',
};

/**
 * Key code enumerable.
 *
 * @type {{TAB: string, ENTER: string, ESC: string, ARROW_LEFT: string, ARROW_UP: string, ARROW_RIGHT: string, ARROW_DOWN: string}}
 */
export const KeyCodes = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

/**
 * Methods enumerable.
 * @type {{DELETE: string, GET: string, PATCH: string, POST: string,}}
 */
export const Methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
};

/**
  * Confirmation modal texts
  * @type {{}}
  */
export const ConfirmationModalTexts = {
  CANCEL_CHANGES: {
    BUTTON: 'Poistu tallentamatta',
    LABEL: <span>Lomakkeella on tallentamattomia muutoksia.<br /> Haluatko varmasti poistua tallentamatta?</span>,
    TITLE: 'Poistu tallentamatta',
  },
};

/**
 * Delete modal label text enumerable.
 * @type {{}}
 */
export const DeleteModalLabels = {
  LEASE_INSPECTION_ATTACHMENT: 'Haluatko varmasti poistaa tiedoston?',
  LEASE_MANAGEMENT_SUBVENTION: 'Haluatko varmasti poistaa hallintamuodon?',
  LEASE_SUBVENTIONS: 'Haluatko varmasti poistaa subvention?',
  LEASE_TEMPORARY_SUBVENTION: 'Haluatko varmasti poistaa tilapäisalennuksen?',
  LEASEHOLD_TRANSFER: 'Haluatko varmasti poistaa vuokraoikeuden siirron?',
};

/**
 * Delete modal title text enumerable.
 * @type {{}}
 */
export const DeleteModalTitles = {
  LEASE_INSPECTION_ATTACHMENT: 'Poista tiedosto',
  LEASE_MANAGEMENT_SUBVENTION: 'Poista hallintamuoto',
  LEASE_SUBVENTIONS: 'Poista subventio',
  LEASE_TEMPORARY_SUBVENTION: 'Poista tilapäisalennus',
  LEASEHOLD_TRANSFER: 'Poista vuokraoikeuden siirto',

};

/**
 * Lease form names enumerable.
 *
 * @type {{}}
 */
export const FormNames = {
  AREA_NOTE_SEARCH: 'area-note-search-form',
  CONTACT: 'contact-form',
  CONTACT_SEARCH: 'contact-search-form',
  INFILL_DEVELOPMENT: 'infill-development-form',
  INFILL_DEVELOPMENT_SEARCH: 'infill-development-search-form',
  INVOICE_NOTE_CREATE: 'create-invoice-note-form',
  INVOICE_SIMULATOR: 'invoice-simulator-form',
  LAND_USE_CONTRACT_BASIC_INFORMATION: 'land-use-contract-basic-info-form',
  LAND_USE_CONTRACT_COMPENSATIONS: 'land-use-contract-compensations-form',
  LAND_USE_CONTRACT_CONTRACTS: 'land-use-contract-contracts-form',
  LAND_USE_CONTRACT_CREATE: 'create-land-use-contract-form',
  LAND_USE_CONTRACT_DECISIONS: 'land-use-contract-decisions-form',
  LAND_USE_CONTRACT_INVOICES: 'land-use-contract-invoices-form',
  LAND_USE_CONTRACT_SEARCH: 'land-use-contract-search-form',
  LAND_USE_CONTRACT_LITIGANTS: 'land-use-contract-litigants-form',
  LEASE_ARCHIVE_AREA: 'archive-area-form',
  LEASE_AREAS: 'lease-areas-form',
  LEASE_CONSTRUCTABILITY: 'constructability-form',
  LEASE_CONTRACTS: 'contracts-form',
  LEASE_CREATE_COLLECTION_COURT_DECISION: 'create-collection-court-decision-form',
  LEASE_CREATE_COLLECTION_LETTER: 'create-collection-letter-form',
  LEASE_CREATE_MODAL: 'create-lease-form',
  LEASE_DEBT_COLLECTION: 'debt-collection-form',
  LEASE_DECISIONS: 'decisions-form',
  LEASE_INSPECTIONS: 'inspections-form',
  LEASE_INVOICE_CREDIT: 'credit-invoice-form',
  LEASE_INVOICE_EDIT: 'edit-invoice-form',
  LEASE_INVOICE_NEW: 'new-invoice-form',
  LEASE_INVOICE_NOTES: 'invoice-notes-form',
  LEASE_NEW_COMMENT: 'new-comment-form',
  LEASE_REFUND: 'refund-form',
  LEASE_RENTS: 'rents-form',
  LEASE_SEARCH: 'lease-search-form',
  LEASE_SUMMARY: 'summary-form',
  LEASE_TENANTS: 'tenants-form',
  LEASEHOLD_TRANSFER_SEARCH: 'leasehold-transfer-search-form',
  RENT_BASIS: 'rent-basis-form',
  RENT_BASIS_SEARCH: 'rent-basis-search-form',
  RENT_CALCULATOR: 'rent-calculator-form',
  TRADE_REGISTER_SEARCH: 'trade-register-search-form',
};

/**
 * Permission missing texts enumerable.
 *
 * @type {{}}
 */
export const PermissionMissingTexts = {
  AREA_NOTE: 'Ei oikeuksia muistettaviin ehtoihiin',
  BATCHRUN: 'Ei oikeuksia eräajoihin',
  CONTACT: 'Ei oikeuksia asiakkaisiin',
  GENERAL: 'Ei oikeuksia sisältöön.',
  INDEX: 'Ei oikeksia elinkustannusindekseihin',
  INFILL_DEVELOPMENT: 'Ei oikeksia täydennysrakennuskorvauksiin',
  INVOICE: 'Ei oikeuksia laskuihin',
  INVOICE_NOTE: 'Ei oikeuksia laskujen tiedotteisiin',
  LEASE: 'Ei oikeuksia vuokrauksiin.',
  LEASEHOLD_TRANSFER: 'Ei oikeuksia vuokraoikeuden siirtoihin',
  LEASE_TENANTS_EDIT: 'Ei oikeuksia muokata vuokralaisia',
  RENT_BASIS: 'Ei oikeuksia vuokrausperusteisiin.',
  TRADE_REGISTER: 'Ei oikeuksia kaupparekisteriotteisiin',
};
