import React from "react";
import { DELETE_MODAL_BUTTON_TEXT } from "./util/constants";

/**
 * Table sort order enumerable.
 * @readonly
 * @enum {string}
 */
export const TableSortOrder = {
  ASCENDING: "asc",
  DESCENDING: "desc",
};

/**
 * View modes enumerable.
 * @readonly
 * @enum {string}
 */
export const ViewModes = {
  EDIT: "edit",
  READONLY: "readonly",
};

/**
 * Key code enumerable.
 * @readonly
 * @enum {number}
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
 * @readonly
 * @enum {string}
 */
export const Methods = {
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
};

/**
 * Confirmation modal texts
 * @readonly
 * @enum {Object}
 */
export const ConfirmationModalTexts = {
  ARCHIVE_LEASE_AREA: {
    BUTTON: "Arkistoi",
    LABEL: "Haluatko varmasti arkistoida kohteen?",
    TITLE: "Arkistoi kohde",
  },
  ARCHIVE_LEASE_BASIS_OF_RENT: {
    BUTTON: "Arkistoi",
    LABEL: "Haluatko varmasti arkistoida vuokralaskurin?",
    TITLE: "Arkistoi vuokralaskuri",
  },
  CANCEL_CHANGES: {
    BUTTON: "Poistu tallentamatta",
    LABEL: (
      <span>
        Lomakkeella on tallentamattomia muutoksia.
        <br /> Haluatko varmasti poistua tallentamatta?
      </span>
    ) as React.ReactElement<React.ComponentProps<"span">, "span">,
    TITLE: "Poistu tallentamatta",
  },
  CLOSE_COMMENT_PANEL: {
    BUTTON: "Sulje kommentointi",
    LABEL: (
      <span>
        Kaikkia muutoksia ei ole tallennettu.
        <br /> Haluatko varmasti sulkea kommentoinnin?
      </span>
    ) as React.ReactElement<React.ComponentProps<"span">, "span">,
    TITLE: "Sulje kommentointi",
  },
  COPY_AREAS_TO_CONTRACT: {
    BUTTON: "Kopioi sopimukseen",
    LABEL:
      "Haluatko varmasti kopioda nykyhetken kiinteistöt, määräalat ja kaavayksiköt sopimukseen?",
    TITLE: "Kopioi sopimukseen",
  },
  CREATE_CONTACT: {
    BUTTON: "Luo asiakas",
    LABEL: (
      <span>
        Tunnuksella on jo olemassa asiakas palvelukokonaisuudessa.
        <br />
        Haluatko luoda asiakkaan?
      </span>
    ) as React.ReactElement<React.ComponentProps<"span">, "span">,
    TITLE: "Luo asiakas",
  },
  DELETE_ADDRESS: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa osoitteen?",
    TITLE: "Poista osoite",
  },
  DELETE_AREA_NOTE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa muistettavan ehdon?",
    TITLE: "Poista muistettava ehto",
  },
  DELETE_ATTACHMENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa tiedoston?",
    TITLE: "Poista tiedosto",
  },
  DELETE_BILLING_PERSON: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa laskunsaajan?",
    TITLE: "Poista laskunsaaja",
  },
  DELETE_COLLATERAL: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vakuuden?",
    TITLE: "Poista vakuus",
  },
  DELETE_COLLECTION_COURT_DECISIONS: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa käräjäoikeuden päätöksen?",
    TITLE: "Poista käräjäoikeuden päätös",
  },
  DELETE_COLLECTION_LETTER: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa perintäkirjeen?",
    TITLE: "Poista perintäkirje",
  },
  DELETE_COMPENSATION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa korvauksen?",
    TITLE: "Poista korvaus",
  },
  DELETE_CONDITION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa ehdon?",
    TITLE: "Poista ehto",
  },
  DELETE_CONTRACT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa sopimuksen?",
    TITLE: "Poista sopimus",
  },
  DELETE_CONTRACT_CHANGE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa sopimuksen muutoksen?",
    TITLE: "Poista sopimuksen muutos",
  },
  DELETE_CONTRACT_RENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa sopimusvuokran",
    TITLE: "Poista sopimusvuokra",
  },
  DELETE_DECISION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kohteen?",
    TITLE: "Poista kohde",
  },
  DELETE_CUSTOM_DETAILED_PLAN: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Halutako varmasti poistaa oman muun alueen?",
    TITLE: "Poista oma muu alue",
  },
  DELETE_INFO_LINKS: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Halutako varmasti poistaa lisätietolinkin?",
    TITLE: "Poista lisätietolinkki",
  },
  DELETE_SUGGESTION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa ehdotuksen?",
    TITLE: "Poista ehdotus",
  },
  DELETE_APPLICANT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa hakijan?",
    TITLE: "Poista hakija",
  },
  DELETE_TARGET: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kohteen?",
    TITLE: "Poista kohde",
  },
  DELETE_FIXED_INITIAL_YEAR_RENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kiinteän alkuvuosivuokran?",
    TITLE: "Poista kiinteä alkuvuosivuokra",
  },
  DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL:
      "Haluatko varmasti poistaa vuokrauksen täydennysrakentamiskorvauksesta?",
    TITLE: "Poista vuokraus täydennysrakentamiskorvauksesta",
  },
  DELETE_INFO_LINK: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa lisätietolinkin?",
    TITLE: "Poista lisätietolinkki",
  },
  DELETE_INSPECTION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa tarkastuksen?",
    TITLE: "Poista tarkastus",
  },
  DELETE_INTENDED_USE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa käyttötarkoituksen?",
    TITLE: "Poista käyttötarkoitus",
  },
  DELETE_INVOICE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa laskun?",
    TITLE: "Poista lasku",
  },
  DELETE_INVOICE_NOTE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa maksun?",
    TITLE: "Poista maksu",
  },
  DELETE_INVOICE_PAYMENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa maksun?",
    TITLE: "Poista maksu",
  },
  DELETE_INVOICE_ROW: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa laskurivin?",
    TITLE: "Poista laskurivi",
  },
  DELETE_LAND_USE_CONTRACT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa maankäyttösopimuksen?",
    TITLE: "Poista maankäyttösopimus",
  },
  DELETE_LEASE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokraustunnuksen?",
    TITLE: "Poista vuokraustunnus",
  },
  DELETE_LEASE_AREA: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kohteen?",
    TITLE: "Poista kohde",
  },
  DELETE_LEASE_BASIS_OF_RENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokralaskurin?",
    TITLE: "Poista vuokralaskuri",
  },
  DELETE_LEASEHOLD_TRASFER: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokraoikeuden siirron?",
    TITLE: "Poista vuokraoikeuden siirto",
  },
  DELETE_LITIGANT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa osapuolen?",
    TITLE: "Poista osapuoli",
  },
  DELETE_MANAGEMENT_SUBVENTION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa hallintamuodon?",
    TITLE: "Poista hallintamuoto",
  },
  DELETE_NOTE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa huomautuksen?",
    TITLE: "Poista huomautus",
  },
  DELETE_OTHER_TENANT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa laskunsaajan/yhteyshenkilön?",
    TITLE: "Poista laskunsaaja/yhteyshenkilö",
  },
  DELETE_PLAN_UNIT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kaavayksikön?",
    TITLE: "Poista kaavayksikkö",
  },
  DELETE_PLOT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kiinteistön/määräalan?",
    TITLE: "Poista kiinteistö/määräala",
  },
  DELETE_PROPERTY_IDENTIFIER: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kiinteisötunnuksen?",
    TITLE: "Poista kiinteistötunnus",
  },
  DELETE_RELATED_LEASE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokratunnusten välisen liitoksen?",
    TITLE: "Poista liitos",
  },
  DELETE_RENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokran?",
    TITLE: "Poista vuokra",
  },
  DELETE_RENT_ADJUSTMENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa alennuksen/korotuksen?",
    TITLE: "Poista alennus/korotus",
  },
  DELETE_RENT_FOR_PERIOD: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokralaskelman",
    TITLE: "Poista vuokralaskelma",
  },
  DELETE_RENT_RATE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa hinnan?",
    TITLE: "Poista hinta",
  },
  DELETE_RENT_SHARE: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa laskutusosuuden?",
    TITLE: "Poista laskutusosuus",
  },
  DELETE_SUBVENTION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa subvention?",
    TITLE: "Poista subvention",
  },
  DELETE_TEMPORARY_SUBVENTION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa tilapäisalennuksen?",
    TITLE: "Poista tilapäisalennus",
  },
  DELETE_TENANT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa vuokralaisen?",
    TITLE: "Poista vuokralainen",
  },
  DELETE_UI_DATA: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa ohjetekstin",
    TITLE: "Poista ohjeteksti",
  },
  DELETE_USAGE_DISTRIBUTIONS: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa käyttöjakauman?",
    TITLE: "Poista käyttöjakauma",
  },
  RESTORE_CHANGES: {
    BUTTON: "Palauta muutokset",
    LABEL:
      "Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?",
    TITLE: "Palauta tallentamattomat muutokset",
  },
  SET_RENT_INFO_COMPLETE: {
    BUTTON: "Merkitse valmiiksi",
    LABEL: "Haluatko varmasti merkitä vuokratiedot valmiiksi?",
    TITLE: "Merkitse vuokratiedot valmiiksi",
  },
  SET_RENT_INFO_UNCOMPLETE: {
    BUTTON: "Merkitse keskeneräisiksi",
    LABEL: "Haluatko varmasti merkitä vuokratiedot keskeneräisiksi?",
    TITLE: "Merkitse vuokratiedot keskeneräisiksi",
  },
  START_INVOICING: {
    BUTTON: "Käynnistä laskutus",
    LABEL: "Haluatko varmasti käynnistää laskutuksen?",
    TITLE: "Käynnistä laskutus",
  },
  STOP_INVOICING: {
    BUTTON: "Keskeytä laskutus",
    LABEL: "Haluatko varmasti keskeyttää laskutuksen?",
    TITLE: "Keskeytä laskutus",
  },
  UNARCHIVE_LEASE_AREA: {
    BUTTON: "Siirrä arkistosta",
    LABEL: "Haluatko varmasti siirtää kohteen pois arkistosta?",
    TITLE: "Siirrä arkistosta",
  },
  UNARCHIVE_LEASE_BASIS_OF_RENT: {
    BUTTON: "Siirrä arkistosta",
    LABEL: "Haluatko varmasti siirtää vuokralaskurin pois arkistosta?",
    TITLE: "Siirrä arkistosta",
  },
  DELETE_PLOT_SEARCH: {
    BUTTON: "Poista tonttihaku",
    LABEL: "Haluatko varmasti poistaa tonttihaun?",
    TITLE: "Poista tonttihaku",
  },
  DELETE_PLOT_APPLICATION: {
    BUTTON: "Poista tonttihakemus",
    LABEL: "Haluatko varmasti poistaa tonttihakemuksen?",
    TITLE: "Poista tonttihakemus",
  },
  DELETE_SECTION_FIELD: {
    BUTTON: "Poista kenttä",
    LABEL: "Haluatko varmasti poistaa kentän?",
    TITLE: "Poista kenttä",
  },
  DELETE_SECTION_SUBSECTION: {
    BUTTON: "Poista aliosio",
    LABEL: "Haluatko varmasti poistaa aliosion?",
    TITLE: "Poista aliosio",
  },
  DELETE_APPLICATION_TARGET_PROPOSED_MANAGEMENT: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa hallinta- ja rahoitusmuotoehdotuksen?",
    TITLE: "Poista ehdotettu hallinta- ja rahoitusmuoto",
  },
  DELETE_APPLICATION_TARGET_CONDITION: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa varausehdon?",
    TITLE: "Poista varausehto",
  },
  DELETE_APPLICATION_TARGET_MEETING_MEMO: {
    BUTTON: DELETE_MODAL_BUTTON_TEXT,
    LABEL: "Haluatko varmasti poistaa kokousmuistion?",
    TITLE: "Poista kokousmuistio",
  },
};

/**
 * Redux form field type enumerable.
 * @readonly
 * @enum {string}
 */
export const FieldTypes = {
  ADDRESS: "address",
  AREASEARCH_DISTRICT: "areasearch-district",
  BOOLEAN: "boolean",
  CHOICE: "choice",
  CHECKBOX: "checkbox",
  CHECKBOX_DATE_TIME: "checkbox-date-time",
  CONTACT: "contact",
  DATE: "date",
  DECIMAL: "decimal",
  FIELD: "field",
  INTEGER: "integer",
  INTENDED_USE: "intended_use",
  LEASE: "lease",
  LESSOR: "lessor",
  MULTISELECT: "multiselect",
  RADIO_WITH_FIELD: "radio-with-field",
  REFERENCE_NUMBER: "reference_number",
  SEARCH: "search",
  STRING: "string",
  TEXTAREA: "textarea",
  USER: "user",
  TIME: "time",
  HIDDEN: "hidden",
  FRACTIONAL: "fractional",
} as const;

/**
 * Lease form names enumerable.
 * @readonly
 * @enum {string}
 */
export const FormNames = {
  AREA_NOTE_SEARCH: "area-note-search-form",
  AREA_SEARCH_SEARCH: "area-search-search-form",
  BASIS_OF_RENT_CALCULATOR: "basis-of-rent-calculator-form",
  CONTACT: "contact-form",
  CONTACT_SEARCH: "contact-search-form",
  CREDIT_DECISION_SEARCH: "credit-info-search-form",
  INFILL_DEVELOPMENT: "infill-development-form",
  INFILL_DEVELOPMENT_SEARCH: "infill-development-search-form",
  INVOICE_NOTE_CREATE: "create-invoice-note-form",
  INVOICE_NOTE_SEARCH: "invoice-note-search-form",
  INVOICE_SIMULATOR: "invoice-simulator-form",
  LAND_USE_CONTRACT_BASIC_INFORMATION: "land-use-contract-basic-info-form",
  LAND_USE_CONTRACT_COMPENSATIONS: "land-use-contract-compensations-form",
  LAND_USE_CONTRACT_CONTRACTS: "land-use-contract-contracts-form",
  LAND_USE_CONTRACT_CREATE: "create-land-use-contract-form",
  LAND_USE_CONTRACT_DECISIONS: "land-use-contract-decisions-form",
  LAND_USE_CONTRACT_INVOICES: "land-use-contract-invoices-form",
  LAND_USE_CONTRACT_SEARCH: "land-use-contract-search-form",
  LAND_USE_CONTRACT_LITIGANTS: "land-use-contract-litigants-form",
  LEASE_ARCHIVE_AREA: "archive-area-form",
  LEASE_AREAS: "lease-areas-form",
  LEASE_CONSTRUCTABILITY: "constructability-form",
  LEASE_CONTRACTS: "contracts-form",
  LEASE_CREATE_COLLECTION_COURT_DECISION:
    "create-collection-court-decision-form",
  LEASE_CREATE_COLLECTION_LETTER: "create-collection-letter-form",
  LEASE_CREATE_MODAL: "create-lease-form",
  LEASE_DEBT_COLLECTION: "debt-collection-form",
  LEASE_DECISIONS: "decisions-form",
  LEASE_INSPECTIONS: "inspections-form",
  LEASE_INVOICE_CREDIT: "credit-invoice-form",
  LEASE_INVOICE_EDIT: "edit-invoice-form",
  LEASE_INVOICE_NEW: "new-invoice-form",
  LAND_USE_INVOICE_NEW: "land-use-invoice-form",
  LEASE_INVOICE_NOTES: "invoice-notes-form",
  LEASE_NEW_COMMENT: "new-comment-form",
  LEASE_REFUND: "refund-form",
  LEASE_RENTS: "rents-form",
  LEASE_SEARCH: "lease-search-form",
  LEASE_STEPPED_DISCOUNT: "lease-stepped-discount-form",
  LEASE_SUMMARY: "summary-form",
  LEASE_STATISTIC_REPORT: "lease-statistic-report-form",
  LEASE_TENANTS: "tenants-form",
  LEASEHOLD_TRANSFER_SEARCH: "leasehold-transfer-search-form",
  PLOT_SEARCH_SUMMARY: "plot-search-form",
  PLOT_SEARCH_SEARCH: "plot-search-search",
  PLOT_SEARCH_CREATE: "plot-search-create",
  RENT_BASIS: "rent-basis-form",
  RENT_BASIS_SEARCH: "rent-basis-search-form",
  RENT_CALCULATOR: "rent-calculator-form",
  TRADE_REGISTER_SEARCH: "trade-register-search-form",
  PLOT_SEARCH_BASIC_INFORMATION: "plot-search-basic-information-form",
  PLOT_SEARCH_DIRECT_RESERVATION_LINK: "plot-search-direct-reservation-link",
  PLOT_SEARCH_APPLICATION: "plot-search-application-form",
  PLOT_SEARCH_APPLICATION_SECTION_STAGING:
    "plot-search-application-form-section-staging",
  PLOT_SEARCH_APPLICATION_PREVIEW_MOCK_FORM:
    "plot-search-application-preview-mock-form",
  PLOT_SEARCH_APPLICATIONS_OPENING: "plot-search-applications-opening",
  PLOT_APPLICATIONS_CREATE: "plot-application-create-form",
  PLOT_APPLICATIONS_SEARCH: "plot-application-search",
  PLOT_APPLICATION: "plot-application",
  PLOT_APPLICATION_PREVIEW: "plot-application-preview",
  PLOT_APPLICATION_OPENING: "plot-application-opening",
  APPLICANT_INFO_CHECK: "applicant-info-check",
  PLOT_APPLICATION_TARGET_INFO_CHECK: "plot-application-target-info-check",
  LAND_USE_CONTRACT_CONDITIONS: "land-use-contract-conditions",
  LAND_USE_CONTRACT_INVOICE_EDIT: "land-use-contract-invoice-edit",
  AREA_SEARCH: "area-search",
  AREA_SEARCH_CREATE_SPECS: "area-search-create-specs",
  AREA_SEARCH_CREATE_FORM: "area-search-create-form",
  AREA_SEARCH_PREPARER: "area-search-preparer",
  AREA_SEARCH_EXPORT: "area-search-export",
  USER_SERVICE_UNIT_SELECT: "user-service-unit-select",
  SAP_INVOICE_SEARCH: "sap-invoice-search",
};

/**
 * Permission missing texts enumerable.
 * @readonly
 * @enum {string}
 */
export const PermissionMissingTexts = {
  AREA_NOTE: "Ei oikeuksia muistettaviin ehtoihiin",
  AREA_SEARCH: "Ei oikeuksia aluehakuihin",
  BASIS_OF_RENT_CALCULATOR: "Ei oikeuksia vuokralaskuriin",
  BATCHRUN: "Ei oikeuksia eräajoihin",
  CONTACT: "Ei oikeuksia asiakkaisiin",
  CREDIT_DECISION: "Ei oikeuksia asiakastietoon",
  GENERAL: "Ei oikeuksia sisältöön.",
  INDEX: "Ei oikeksia elinkustannusindekseihin",
  INFILL_DEVELOPMENT: "Ei oikeksia täydennysrakennuskorvauksiin",
  INVOICE: "Ei oikeuksia laskuihin",
  INVOICE_NOTE: "Ei oikeuksia laskujen tiedotteisiin",
  LEASE: "Ei oikeuksia vuokrauksiin.",
  LEASEHOLD_TRANSFER: "Ei oikeuksia vuokraoikeuden siirtoihin",
  LEASE_TENANTS_EDIT: "Ei oikeuksia muokata vuokralaisia",
  RENT_BASIS: "Ei oikeuksia vuokrausperusteisiin.",
  STATISTICS_AND_REPORTS: "Ei oikeuksia tilastoihin ja raportteihin",
  TRADE_REGISTER: "Ei oikeuksia kaupparekisteriotteisiin",
  PLOT_SEARCH: "Ei oikeuksia tonttihakuun",
  PLOT_APPLICATIONS: "Ei oikeuksia tonttihakemuksiin",
  LAND_USE_CONTRACTS: "Ei oikeuksia maankäyttösopimuksiin",
};
