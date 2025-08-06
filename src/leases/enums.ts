import { getDayMonth } from "@/util/date";

/**
 * Area location enumerable.
 *
 * @type {{SURFACE: string, UNDERGROUND: string}}
 */
export const AreaLocation = {
  SURFACE: "surface",
  UNDERGROUND: "underground",
};

/**
 * Calculator types enumerable.
 *
 * @type {{}}
 */
export const CalculatorTypes = {
  LEASE2022: "lease2022",
  LEASE: "lease",
  TEMPORARY: "temporary",
  ADDITIONAL_YARD: "additional_yard",
  FIELD: "field",
  MAST: "mast",
  DEVICE_CABINET: "device cabinet",
};

/**
 * Collateral types enumerable.
 *
 * @type {{}}
 */
export const CollateralTypes = {
  FINANCIAL_GUARANTEE: 2,
  MORTGAGE_DOCUMENT: 1,
  OTHER: 3,
};

/**
 * Contract rent period enumerable.
 *
 * @type {{}}
 */
export const ContractRentPeriods = {
  PER_MONTH: "per_month",
  PER_YEAR: "per_year",
};

/**
 * Create lease form field name enumerable.
 *
 * @type {{}}
 */
export const CreateLeaseFormFieldNames = {
  STATE: "state",
  SERVICE_UNIT: "service_unit",
  TYPE: "type",
  MUNICIPALITY: "municipality",
  DISTRICT: "district",
  REFERENCE_NUMBER: "reference_number",
  NOTE: "note",
  APPLICATION_RECEIVED_AT: "application_received_at",
  RELATE_TO: "relate_to",
  START_DATE: "start_date",
  END_DATE: "end_date",
  AREA_SEARCH_ID: "area_search_id",
};

/**
 * Decision type kinds enumerable.
 *
 * @type {{}}
 */
export const DecisionTypeKinds = {
  BASIS_OF_RENT: "basis_of_rent",
  LEASE_CANCELLATION: "lease_cancellation",
};

/**
 * Lease relation type enumerable.
 *
 * @type {{}}
 */
export const RelationTypes = {
  TRANSFER: "transfer",
};

/**
 * Lease rent adjustemnt type enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentTypes = {
  DISCOUNT: "discount",
  INCREASE: "increase",
};

/**
 * Lease rent adjustemnt amount type enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentAmountTypes = {
  AMOUNT_PER_YEAR: "amount_per_year",
  AMOUNT_TOTAL: "amount_total",
  PERCENT_PER_YEAR: "percent_per_year",
};

/**
 * Send email type enumerable.
 *
 * @type {{}}
 */
export const SendEmailTypes = {
  CONSTRUCTABILITY: "constructability",
};

/**
 * LeaseState enumerable.
 *
 * @type {{}}
 */
export const LeaseState = {
  LEASE: "lease",
  SHORT_TERM_LEASE: "short_term_lease",
  LONG_TERM_LEASE: "long_term_lease",
  RESERVATION: "reservation",
  RESERVE: "reserve",
  PERMISSION: "permission",
  TENURE: "tenure",
  RYA: "rya",
  POWER_OF_ATTORNEY: "power_of_attorney",
} as const;

/**
 * Classification enumerable.
 *
 * @type {{}}
 */
export const Classification = {
  PUBLIC: "public",
  CONFIDENTIAL: "confidential",
  OFFICIAL: "official",
} as const;

/**
 * CreditInvoiceOptions enumerable.
 *
 * @type {{FULL: string, RECEIVABLE_TYPE: string, RECEIVABLE_TYPE_AMOUNT: string,}}
 */
export const CreditInvoiceOptions = {
  FULL: "full",
  RECEIVABLE_TYPE: "receivable_type",
  RECEIVABLE_TYPE_AMOUNT: "receivable_type_amount",
};

/**
 * Stepped discount amount types enumerate.
 * @type {{}}
 */
export const SteppedDiscountAmountTypes = {
  PERCENTAGE_PER_YEAR: "percentage_per_year",
  PERCENTAGE_PER_6_MONTHS: "percentage_per_6_months",
  PERCENTAGE_PER_MONTH: "percentage_per_month",
};

/**
 * Constructability status enumerable.
 *
 * @type {{UNVERIFIED: string, REQUIRES_MEASURES: string, COMPLETE: string, ENQUIRY_SENT: string}}
 */
export const ConstructabilityStatus = {
  UNVERIFIED: "unverified",
  REQUIRES_MEASURES: "requires_measures",
  COMPLETE: "complete",
  ENQUIRY_SENT: "enquiry_sent",
};

/**
 * Constructability type enumerable.
 *
 * @type {{PRECONSTRUCTION: string, DEMOLITION: string, POLLLUTED_LAND: string, REPORT: string, OTHER: string}}
 */
export const ConstructabilityType = {
  PRECONSTRUCTION: "preconstruction",
  DEMOLITION: "demolition",
  POLLUTED_LAND: "polluted_land",
  REPORT: "report",
  OTHER: "other",
};

/**
 * Lease status enumerable.
 *
 * @type {{PREPARATION: string, IN_EFFECT: string, FINISHED: string}}
 */
export const LeaseStatus = {
  PREPARATION: "Valmisteilla",
  IN_EFFECT: "Voimassa",
  FINISHED: "Päättynyt",
};

/**
 * Rent due date type enumerable.
 *
 * @type {{REAL_PROPERTY: string, UNSEPARATED_PARCEL: string,}}
 */
export const PlotType = {
  REAL_PROPERTY: "real_property",
  UNSEPARATED_PARCEL: "unseparated_parcel",
};

/**
 * Rent due date type enumerable.
 *
 * @type {{CUSTOM: string, FIXED: string,}}
 */
export const RentDueDateTypes = {
  CUSTOM: "custom",
  FIXED: "fixed",
};

/**
 * Rent type enumerable.
 *
 * @type {{INDEX: string, ONE_TIME: string, FIXED: string, FREE: string, MANUAL: string}}
 */
export const RentTypes = {
  INDEX: "index",
  INDEX2022: "index2022",
  ONE_TIME: "one_time",
  FIXED: "fixed",
  FREE: "free",
  MANUAL: "manual",
};

/**
 * Rent cycle enumerable.
 *
 * @type {{JANUARY_TO_DECEMBER: string, APRIL_TO_MARCH: string}}
 */
export const RentCycles = {
  JANUARY_TO_DECEMBER: "january_to_december",
  APRIL_TO_MARCH: "april_to_march",
};

/**
 * Subvention type enumerable.
 *
 * @type {{}}
 */
export const SubventionTypes = {
  RE_LEASE: "re_lease",
  FORM_OF_MANAGEMENT: "form_of_management",
};

/**
 * Credit invoiceset options
 * @type {[*]}
 */
const FirstDayOfEveryMonth = [
  getDayMonth(1, 1),
  getDayMonth(1, 2),
  getDayMonth(1, 3),
  getDayMonth(1, 4),
  getDayMonth(1, 5),
  getDayMonth(1, 6),
  getDayMonth(1, 7),
  getDayMonth(1, 8),
  getDayMonth(1, 9),
  getDayMonth(1, 10),
  getDayMonth(1, 11),
  getDayMonth(1, 12),
];

/**
 * Due dates position enumerable.
 *
 * @type {{}}
 */
export const DueDatesPositions = {
  START_OF_MONTH: "start_of_month",
  MIDDLE_OF_MONTH: "middle_of_month",
};

/**
 * Fixed due dates enumerable.
 *
 * @type {{}}
 */
export const FixedDueDates: Record<string, any> = {
  [DueDatesPositions.START_OF_MONTH]: {
    "1": [getDayMonth(2, 1)],
    "2": [getDayMonth(2, 1), getDayMonth(1, 7)],
    "4": [
      getDayMonth(2, 1),
      getDayMonth(1, 4),
      getDayMonth(1, 7),
      getDayMonth(1, 10),
    ],
    "12": FirstDayOfEveryMonth,
  },
  [DueDatesPositions.MIDDLE_OF_MONTH]: {
    "1": [getDayMonth(30, 6)],
    "2": [getDayMonth(15, 3), getDayMonth(30, 9)],
    "4": [
      getDayMonth(1, 3),
      getDayMonth(15, 4),
      getDayMonth(15, 7),
      getDayMonth(15, 10),
    ],
    "12": FirstDayOfEveryMonth,
  },
};

/**
 * Index type enumerable.
 *
 * @type {{INDEX: string, ONE_TIME: string, FIXED: string, FREE: string, MANUAL: string}}
 */
export const IndexTypes = {
  INDEX_50620: "type_1",
  INDEX_4661: "type_2",
  INDEX_418_10: "type_3",
  INDEX_418_20: "type_4",
  INDEX_392: "type_5",
  INDEX_100_ROUNDING: "type_6",
  INDEX_100: "type_7",
};

/**
 * Recipient options enumerable.
 *
 * @type {{ALL: string}}
 */
export const RecipientOptions = {
  ALL: "all",
};

/**
 * Contact type enumerable.
 *
 * @type {{TENANT: string, BILLING: string, CONTACT: string}}
 */
export const TenantContactType = {
  TENANT: "tenant",
  BILLING: "billing",
  CONTACT: "contact",
};

/**
 * Lease field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseFieldPaths = {
  ADDRESS: "lease_areas.child.children.addresses",
  APPLICATION_METADATA: "application_metadata",
  APPLICATION_RECEIVED_AT:
    "application_metadata.children.application_received_at",
  AREA_IDENTIFIER: "lease_areas.child.children.identifier",
  ARRANGEMENT_DECISION: "arrangement_decision",
  AUDIT_LOG: "audit_log",
  BUILDING_SELLING_PRICE: "building_selling_price",
  CLASSIFICATION: "classification",
  CONTRACT_NUMBERS: "contract_numbers",
  CONVEYANCE_NUMBER: "conveyance_number",
  DISTRICT: "district",
  END_DATE: "end_date",
  FINANCING: "financing",
  HISTORY: "history",
  HITAS: "hitas",
  IDENTIFIER: "identifier",
  INFILL_DEVELOPMENT_COMPENSATIONS: "infill_development_compensations",
  INTENDED_USE: "intended_use",
  INTENDED_USE_NOTE: "intended_use_note",
  INTERNAL_ORDER: "internal_order",
  IS_SUBJECT_TO_VAT: "is_subject_to_vat",
  LESSOR: "lessor",
  MANAGEMENT: "management",
  MAP: "map",
  MATCHING_BASIS_OF_RENTS: "matching_basis_of_rents",
  MUNICIPALITY: "municipality",
  NOTE: "note",
  NOTICE_NOTE: "notice_note",
  NOTICE_PERIOD: "notice_period",
  PREPARER: "preparer",
  REAL_ESTATE_DEVELOPER: "real_estate_developer",
  REFERENCE_NUMBER: "reference_number",
  REGULATED: "regulated",
  REGULATION: "regulation",
  RELATED_LEASES: "related_leases",
  RELATE_TO: "relate_to",
  RESERVATION_PROCEDURE: "reservation_procedure",
  SERVICE_UNIT: "service_unit",
  SPECIAL_PROJECT: "special_project",
  START_DATE: "start_date",
  STATE: "state",
  STATISTICAL_USE: "statistical_use",
  STATUS: "status",
  SUMMARY: "summary",
  SUMMARY_BASIC_INFO: "summary_basic_info",
  SUMMARY_STATISTICAL_INFO: "summary_statistical_info",
  SUPPORTIVE_HOUSING: "supportive_housing",
  TRANSFERABLE: "transferable",
  TYPE: "type",
};

/**
 * Lease field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseFieldTitles = {
  ADDRESS: "Osoite",
  APPLICATION_RECEIVED_AT: "Hakemuksen saapumispäivä",
  AREA_IDENTIFIER: "Kohteen tunnus",
  ARRANGEMENT_DECISION: "Järjestelypäätös",
  AUDIT_LOG: "Muutoshistoria",
  BUILDING_SELLING_PRICE: "Rakennuksen kauppahinta",
  CLASSIFICATION: "Julkisuusluokka",
  CONTRACT_NUMBERS: "Sopimusnumero",
  CONVEYANCE_NUMBER: "Luovutusnumero",
  DISTRICT: "Kaupunginosa",
  END_DATE: "Loppupvm",
  FINANCING: "Rahoitusmuoto",
  HISTORY: "Historiapuu",
  HITAS: "Hitas",
  IDENTIFIER: "Vuokraustunnus",
  INFILL_DEVELOPMENT_COMPENSATIONS: "Täydennysrakentamiskorvaus",
  INTENDED_USE: "Vuokrauksen käyttötarkoitus",
  INTENDED_USE_NOTE: "Käyttötarkoituksen huomautus",
  INTERNAL_ORDER: "Sisäinen tilaus",
  IS_SUBJECT_TO_VAT: "Arvonlisävelvollinen",
  LESSOR: "Vuokranantaja",
  MANAGEMENT: "Hallintamuoto",
  MAP: "Kartta",
  MATCHING_BASIS_OF_RENTS: "Vuokrausperiaatteet",
  MUNICIPALITY: "Kunta",
  NOTE: "Huomautus",
  NOTICE_NOTE: "Irtisanomisajan huomautus",
  NOTICE_PERIOD: "Irtisanomisaika",
  PREPARER: "Valmistelija",
  REAL_ESTATE_DEVELOPER: "Rakennuttaja",
  REFERENCE_NUMBER: "Diaarinumero",
  REGULATED: "Sääntely",
  REGULATION: "Sääntelymuoto",
  RELATED_LEASES: "Liittyvät vuokraukset",
  RELATE_TO: "Liittyy vuokraukseen",
  RESERVATION_PROCEDURE: "Varauksen menettely",
  SERVICE_UNIT: "Palvelukokonaisuus",
  SPECIAL_PROJECT: "Erityishanke",
  START_DATE: "Alkupvm",
  STATE: "Tyyppi",
  STATISTICAL_USE: "Tilastollinen pääkäyttötarkoitus",
  STATUS: "Olotila",
  SUMMARY: "Yhteenveto",
  SUMMARY_BASIC_INFO: "Perustiedot",
  SUMMARY_STATISTICAL_INFO: "Tilastotiedot",
  SUPPORTIVE_HOUSING: "Erityisasunnot",
  TRANSFERABLE: "Siirto-oikeus",
  TYPE: "Vuokrauksen laji",
};

/**
 * Lease field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseHistoryItemTypes = {
  PLOTSEARCH: "Haku",
  PLOT_APPLICATION: "Hakemus",
  AREA_SEARCH: "Aluehakemus",
};

/**
 * Lease field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseHistoryContentTypes = {
  PLOTSEARCH: "plotsearch",
  TARGET_STATUS: "targetstatus",
  AREA_SEARCH: "areasearch",
};

/**
 * Lease areas field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseAreasFieldPaths = {
  LEASE_AREAS: "lease_areas",
  ARCHIVED_AT: "lease_areas.child.children.archived_at",
  ARCHIVED_DECISION: "lease_areas.child.children.archived_decision",
  ARCHIVED_NOTE: "lease_areas.child.children.archived_note",
  AREA: "lease_areas.child.children.area",
  CONSTRUCTABILITY: "lease_areas.child.children.constructability",
  CONSTRUCTABILITY_REPORT: "lease_areas.child.children.constructability_report",
  CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS:
    "lease_areas.child.children.constructability_report_geotechnical_attachments",
  CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE:
    "lease_areas.child.children.constructability_report_investigation_state",
  CONSTRUCTABILITY_REPORT_SIGNING_DATE:
    "lease_areas.child.children.constructability_report_signing_date",
  CONSTRUCTABILITY_REPORT_SIGNER:
    "lease_areas.child.children.constructability_report_signer",
  CONSTRUCTABILITY_REPORT_STATE:
    "lease_areas.child.children.constructability_report_state",
  DEMOLITION: "lease_areas.child.children.demolition",
  DEMOLITION_STATE: "lease_areas.child.children.demolition_state",
  GEOMETRY: "lease_areas.child.children.geometry",
  IDENTIFIER: "lease_areas.child.children.identifier",
  LOCATION: "lease_areas.child.children.location",
  OTHER: "lease_areas.child.children.other",
  OTHER_STATE: "lease_areas.child.children.other_state",
  POLLUTED_LAND: "lease_areas.child.children.polluted_land",
  POLLUTED_LAND_MATTI_REPORTS:
    "lease_areas.child.children.polluted_land_matti_reports",
  POLLUTED_LAND_PLANNER: "lease_areas.child.children.polluted_land_planner",
  POLLUTED_LAND_PROJECTWISE_NUMBER:
    "lease_areas.child.children.polluted_land_projectwise_number",
  POLLUTED_LAND_RENT_CONDITION_DATE:
    "lease_areas.child.children.polluted_land_rent_condition_date",
  POLLUTED_LAND_RENT_CONDITION_STATE:
    "lease_areas.child.children.polluted_land_rent_condition_state",
  POLLUTED_LAND_STATE: "lease_areas.child.children.polluted_land_state",
  PRECONSTRUCTION: "lease_areas.child.children.preconstruction",
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT:
    "lease_areas.child.children.preconstruction_estimated_construction_readiness_moment",
  PRECONSTRUCTION_INSPECTION_MOMENT:
    "lease_areas.child.children.preconstruction_inspection_moment",
  PRECONSTRUCTION_STATE: "lease_areas.child.children.preconstruction_state",
  TYPE: "lease_areas.child.children.type",
};

/**
 * Lease area field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreasFieldTitles = {
  LEASE_AREAS: "Vuokrakohde",
  ARCHIVED_AT: "Arkistoitu",
  ARCHIVED_DECISION: "Päätös",
  ARCHIVED_NOTE: "Huomautus",
  AREA: "Pinta-ala",
  CONSTRUCTABILITY: "Rakentamiskelpoisuus",
  CONSTRUCTABILITY_REPORT: "Rakennettavuusselvitys",
  CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS:
    "Geoteknisen palvelun tiedosto",
  CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE: "Selvitys",
  CONSTRUCTABILITY_REPORT_SIGNING_DATE: "Allekirjoituspvm",
  CONSTRUCTABILITY_REPORT_SIGNER: "Allekirjoittaja",
  CONSTRUCTABILITY_REPORT_STATE: "Selvitysaste",
  DEMOLITION: "Purku",
  DEMOLITION_STATE: "Selvitysaste",
  GEOMETRY: "Karttalinkki",
  GEOMETRY_DRAFT: "Luonnostele kartta",
  IDENTIFIER: "Kohteen tunnus",
  LOCATION: "Sijainti",
  OTHER: "Muut",
  OTHER_STATE: "Selvitysaste",
  POLLUTED_LAND: "Pima ja jäte",
  POLLUTED_LAND_MATTI_REPORTS: "Matti raportti",
  POLLUTED_LAND_PLANNER: "PIMA valmistelija",
  POLLUTED_LAND_PROJECTWISE_NUMBER: "ProjectWise numero",
  POLLUTED_LAND_RENT_CONDITION_DATE: "Vuokraehdot pvm",
  POLLUTED_LAND_RENT_CONDITION_STATE: "Vuokraehdot",
  POLLUTED_LAND_STATE: "Selvitysaste",
  PRECONSTRUCTION: "Esirakentaminen, johtosiirrot ja kunnallistekniikka",
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT:
    "Arvioitu rakentamisvalmius (kk/v)",
  PRECONSTRUCTION_INSPECTION_MOMENT: "Tarkistuspäivä (kk/v)",
  PRECONSTRUCTION_STATE: "Selvitysaste",
  TYPE: "Määritelmä",
};

/**
 * Lease area attachments field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAttachmentsFieldPaths = {
  ATTACHMENTS: "lease_areas.child.children.attachments",
  FILE: "lease_areas.child.children.attachments.child.children.file",
  UPLOADED_AT:
    "lease_areas.child.children.attachments.child.children.uploaded_at",
  UPLOADER: "lease_areas.child.children.attachments.child.children.uploader",
};

/**
 * Lease area attachments field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAttachmentsFieldTitles = {
  ATTACHMENTS: "Tiedostot",
  FILE: "Nimi",
  UPLOADED_AT: "Pvm",
  UPLOADER: "Lataaja",
};

/**
 * Lease area addresses field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAddressesFieldPaths = {
  ADDRESSES: "lease_areas.child.children.addresses",
  ADDRESS: "lease_areas.child.children.addresses.child.children.address",
  CITY: "lease_areas.child.children.addresses.child.children.city",
  IS_PRIMARY: "lease_areas.child.children.addresses.child.children.is_primary",
  POSTAL_CODE:
    "lease_areas.child.children.addresses.child.children.postal_code",
};

/**
 * Lease area addresses field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaAddressesFieldTitles = {
  ADDRESSES: "Osoitteet",
  ADDRESS: "Osoite",
  CITY: "Kaupunki",
  IS_PRIMARY: "Ensisijainen osoite",
  POSTAL_CODE: "Postinumero",
};

/**
 * Lease area custom detailed plan field paths enumerable
 *
 * @type {{}}
 */
export const LeaseAreaCustomDetailedPlanFieldPaths = {
  CUSTOM_DETAILED_PLAN: "lease_areas.child.children.custom_detailed_plan",
  IDENTIFIER:
    "lease_areas.child.children.custom_detailed_plan.children.identifier",
  INTENDED_USE:
    "lease_areas.child.children.custom_detailed_plan.children.intended_use",
  ADDRESS: "lease_areas.child.children.custom_detailed_plan.children.address",
  AREA: "lease_areas.child.children.custom_detailed_plan.children.area",
  STATE: "lease_areas.child.children.custom_detailed_plan.children.state",
  TYPE: "lease_areas.child.children.custom_detailed_plan.children.type",
  DETAILED_PLAN:
    "lease_areas.child.children.custom_detailed_plan.children.detailed_plan",
  DETAILED_PLAN_LATEST_PROCESSING_DATE:
    "lease_areas.child.children.custom_detailed_plan.children.detailed_plan_latest_processing_date",
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE:
    "lease_areas.child.children.custom_detailed_plan.children.detailed_plan_latest_processing_date_note",
  RENT_BUILD_PERMISSION:
    "lease_areas.child.children.custom_detailed_plan.children.rent_build_permission",
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT:
    "lease_areas.child.children.custom_detailed_plan.children.preconstruction_estimated_construction_readiness_moment",
  USAGE_DISTRIBUTIONS:
    "lease_areas.child.children.custom_detailed_plan.children.usage_distributions",
  INFO_LINKS:
    "lease_areas.child.children.custom_detailed_plan.children.info_links",
};

/**
 * Lease area draft field paths enumerable.
 *
 * @type {{}}
 */

export const LeaseAreaDraftFieldPaths = {
  IDENTIFIER: "lease_area_draft.children.identifier",
  AREA: "lease_area_draft.children.area",
  GEOMETRY: "lease_area_draft.children.geometry",
  LOCATION: "lease_area_draft.children.location",
  ADDRESS: "lease_area_draft.children.address",
  POSTAL_CODE: "lease_area_draft.children.postal_code",
  CITY: "lease_area_draft.children.city",
};


/**
 * Lease area draft field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaDraftFieldTitles = {
  IDENTIFIER: "Kohteen tunnus",
  AREA: "Pinta-ala",
  GEOMETRY: "Geometria",
  LOCATION: "Sijainti",
  ADDRESS: "Osoite",
  POSTAL_CODE: "Postinumero",
  CITY: "Paikkakunta",
};

/**
 * Lease area usage distribution field paths enumerable
 *
 * @type {{}}
 */
export const LeaseAreaUsageDistributionFieldPaths = {
  DISTRIBUTION:
    "lease_areas.child.children.custom_detailed_plan.children.usage_distributions.child.children.distribution",
  BUILD_PERMISSION:
    "lease_areas.child.children.custom_detailed_plan.children.usage_distributions.child.children.build_permission",
  NOTE: "lease_areas.child.children.custom_detailed_plan.children.usage_distributions.child.children.note",
};

/**
 * Lease area usage distribution field titles enumerable
 *
 * @type {{}}
 */
export const LeaseAreaUsageDistributionFieldTitles = {
  DISTRIBUTION: "Käyttöjakauma",
  BUILD_PERMISSION: "Rakennusoikeus",
  NOTE: "Huomautus",
};

/**
 * Lease area custom detailed plan usage distribution field paths enumerable
 *
 * @type {{}}
 */
export const LeaseAreaCustomDetailedPlanInfoLinksFieldPaths = {
  URL: "lease_areas.child.children.custom_detailed_plan.children.info_links.child.children.url",
  DESCRIPTION:
    "lease_areas.child.children.custom_detailed_plan.children.info_links.child.children.description",
  LANGUAGE:
    "lease_areas.child.children.custom_detailed_plan.children.info_links.child.children.language",
};

/**
 * Lease area custom detailed plan usage distribution field titles enumerable
 *
 * @type {{}}
 */
export const LeaseAreaCustomDetailedPlanInfoLinksFieldTitles = {
  URL: "Lisätietolinkki",
  DESCRIPTION: "Lisätietolinkin kuvaus",
  LANGUAGE: "Kieli",
};

/**
 * Lease area custom detailed plan field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseAreaCustomDetailedPlanFieldTitles = {
  IDENTIFIER: "Kohteen tunnus",
  INTENDED_USE: "Kaavayksikön käyttötarkoitus",
  ADDRESS: "Osoite",
  AREA: "Kokonaisalue",
  STATE: "Kaavayksikön olotila",
  TYPE: "Kaavayksikön laji",
  DETAILED_PLAN: "Asemakaava",
  DETAILED_PLAN_LATEST_PROCESSING_DATE: "Asemakaavan viim. käsittelypvm",
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE: "Asemak. käsittelypvm huomautus",
  RENT_BUILD_PERMISSION: "Kokonaisrakennusoikeus",
  PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT:
    "Arvioitu rakentamisen valmius",
  INFO_LINKS: "Lisätietolinkit",
  USAGE_DISTRIBUTIONS: "Käyttöjakaumat",
};

/**
 * Lease area plan units field paths enumerable.
 *
 * @type {{}}
 */
export const LeasePlanUnitsFieldPaths = {
  PLAN_UNITS: "lease_areas.child.children.plan_units",
  PLAN_UNITS_CONTRACT: "lease_areas.child.children.plan_units_contract",
  AREA: "lease_areas.child.children.plan_units.child.children.area",
  DETAILED_PLAN_IDENTIFIER:
    "lease_areas.child.children.plan_units.child.children.detailed_plan_identifier",
  DETAILED_PLAN_LATEST_PROCESSING_DATE:
    "lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date",
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE:
    "lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note",
  GEOMETRY: "lease_areas.child.children.plan_units.child.children.geometry",
  IDENTIFIER: "lease_areas.child.children.plan_units.child.children.identifier",
  PLAN_UNIT_INTENDED_USE:
    "lease_areas.child.children.plan_units.child.children.plan_unit_intended_use",
  PLAN_UNIT_STATE:
    "lease_areas.child.children.plan_units.child.children.plan_unit_state",
  PLAN_UNIT_TYPE:
    "lease_areas.child.children.plan_units.child.children.plan_unit_type",
  PLOT_DIVISION_EFFECTIVE_DATE:
    "lease_areas.child.children.plan_units.child.children.plot_division_effective_date",
  PLOT_DIVISION_IDENTIFIER:
    "lease_areas.child.children.plan_units.child.children.plot_division_identifier",
  PLOT_DIVISION_STATE:
    "lease_areas.child.children.plan_units.child.children.plot_division_state",
  SECTION_AREA:
    "lease_areas.child.children.plan_units.child.children.section_area",
  IS_MASTER: "lease_areas.child.children.plan_units.child.children.is_master",
};

/**
 * Lease area plan units field titles enumerable.
 *
 * @type {{}}
 */
export const LeasePlanUnitsFieldTitles = {
  PLAN_UNITS: "Kaavayksiköt",
  AREA: "Kokonaisala",
  DETAILED_PLAN_IDENTIFIER: "Asemakaava",
  DETAILED_PLAN_LATEST_PROCESSING_DATE: "Asemakaavan viimeisin käsittelypvm",
  DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE:
    "Asemakaavan viimeisin käsittelypvm huomautus",
  GEOMETRY: "Karttalinkki",
  IDENTIFIER: "Kohteen tunnus",
  PLAN_UNIT_INTENDED_USE: "Kaavayksikön käyttötarkoitus",
  PLAN_UNIT_STATE: "Kaavayksikön olotila",
  PLAN_UNIT_TYPE: "Kaavayksikön laji",
  PLOT_DIVISION_EFFECTIVE_DATE: "Tonttijaon voimaantulopvm",
  PLOT_DIVISION_IDENTIFIER: "Tonttijaon tunnus",
  PLOT_DIVISION_STATE: "Tonttijaon olotila",
  SECTION_AREA: "Leikkausala",
  IS_MASTER: "Onko alkuperäinen?",
  USAGE_DISTRIBUTIONS: "Käyttöjakaumat",
};

/**
 * Lease area plots field paths enumerable.
 *
 * @type {{}}
 */
export const LeasePlotsFieldPaths = {
  PLOTS: "lease_areas.child.children.plots",
  PLOTS_CONTRACT: "lease_areas.child.children.plots_contract",
  AREA: "lease_areas.child.children.plots.child.children.area",
  GEOMETRY: "lease_areas.child.children.plots.child.children.geometry",
  IDENTIFIER: "lease_areas.child.children.plots.child.children.identifier",
  KTJ_LINK: "lease_areas.child.children.plots.child.children.ktj_link",
  REGISTRATION_DATE:
    "lease_areas.child.children.plots.child.children.registration_date",
  REPEAL_DATE: "lease_areas.child.children.plots.child.children.repeal_date",
  SECTION_AREA: "lease_areas.child.children.plots.child.children.section_area",
  TYPE: "lease_areas.child.children.plots.child.children.type",
  CUSTOM_DETAILED_PLAN: "lease_areas.child.children.custom_detailed_plan",
};

/**
 * Lease area plots field titles enumerable.
 *
 * @type {{}}
 */
export const LeasePlotsFieldTitles = {
  PLOTS: "Kiinteistöt / määräalat",
  AREA: "Kokonaisala",
  GEOMETRY: "Karttalinkki",
  IDENTIFIER: "Kohteen tunnus",
  KTJ_LINK: "Ktj-dokumentit",
  REGISTRATION_DATE: "Rekisteröintipvm",
  REPEAL_DATE: "Kumoamispvm",
  SECTION_AREA: "Leikkausala",
  TYPE: "Määritelmä",
};

/**
 * Lease area constructability descriptions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseConstructabilityDescriptionsFieldPaths = {
  CONSTRUCTABILITY_DESCRIPTIONS:
    "lease_areas.child.children.constructability_descriptions",
  AHJO_REFERENCE_NUMBER:
    "lease_areas.child.children.constructability_descriptions.child.children.ahjo_reference_number",
  IS_STATIC:
    "lease_areas.child.children.constructability_descriptions.child.children.is_static",
  TEXT: "lease_areas.child.children.constructability_descriptions.child.children.text",
  TYPE: "lease_areas.child.children.constructability_descriptions.child.children.type",
};

/**
 * Lease area constructability descriptions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseConstructabilityDescriptionsFieldTitles = {
  CONSTRUCTABILITY_DESCRIPTIONS: "Huomautukset",
  AHJO_REFERENCE_NUMBER: "AHJO diaarinumero",
  IS_STATIC: "Pysyvä huomautus",
  TEXT: "Huomautus",
  TYPE: "Tyyppi",
};

/**
 * Lease tenants field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantsFieldPaths = {
  TENANTS: "tenants",
  REFERENCE: "tenants.child.children.reference",
  SHARE_DENOMINATOR: "tenants.child.children.share_denominator",
  SHARE_FRACTION: "tenants.child.children.share_fraction",
  SHARE_NUMERATOR: "tenants.child.children.share_numerator",
  SHARE_PERCENTAGE: "tenants.child.children.share_percentage",
};

/**
 * Lease tenants field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantsFieldTitles = {
  TENANTS: "Vuokralaiset",
  REFERENCE: "Viite",
  SHARE_DENOMINATOR: "Jakaja",
  SHARE_FRACTION: "Hallintaosuus",
  SHARE_NUMERATOR: "Jaettava",
  SHARE_PERCENTAGE: "Laskun hallintaosuus",
};

/**
 * Lease tenants field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantRentSharesFieldPaths = {
  RENT_SHARES: "tenants.child.children.rent_shares",
  INTENDED_USE:
    "tenants.child.children.rent_shares.child.children.intended_use",
  SHARE_DENOMINATOR:
    "tenants.child.children.rent_shares.child.children.share_denominator",
  SHARE_FRACTION:
    "tenants.child.children.rent_shares.child.children.share_fraction",
  SHARE_NUMERATOR:
    "tenants.child.children.rent_shares.child.children.share_numerator",
};

/**
 * Lease tenants field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantRentSharesFieldTitles = {
  RENT_SHARES: "Laskutusosuudet",
  INTENDED_USE: "Käyttötarkoitus",
  SHARE_DENOMINATOR: "Jakaja",
  SHARE_FRACTION: "Laskutusosuus",
  SHARE_NUMERATOR: "Jaettava",
};

/**
 * Lease tenants field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantContactSetFieldPaths = {
  TENANTCONTACT_SET: "tenants.child.children.tenantcontact_set",
  CONTACT: "tenants.child.children.tenantcontact_set.child.children.contact",
  END_DATE: "tenants.child.children.tenantcontact_set.child.children.end_date",
  START_DATE:
    "tenants.child.children.tenantcontact_set.child.children.start_date",
  TYPE: "tenants.child.children.tenantcontact_set.child.children.type",
};

/**
 * Lease tenants field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseTenantContactSetFieldTitles = {
  CONTACT: "Asiakas",
  END_DATE: "Loppupvm",
  START_DATE: "Alkupvm",
  TYPE: "Tyyppi",
};

/**
 * Lease rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentsFieldPaths = {
  RENTS: "rents",
  AMOUNT: "rents.child.children.amount",
  CYCLE: "rents.child.children.cycle",
  DUE_DATES_PER_YEAR: "rents.child.children.due_dates_per_year",
  DUE_DATES_TYPE: "rents.child.children.due_dates_type",
  ELEMENTARY_INDEX: "rents.child.children.elementary_index",
  END_DATE: "rents.child.children.end_date",
  EQUALIZATION_END_DATE: "rents.child.children.equalization_end_date",
  EQUALIZATION_START_DATE: "rents.child.children.equalization_start_date",
  INDEX_ROUNDING: "rents.child.children.index_rounding",
  INDEX_TYPE: "rents.child.children.index_type",
  RENT_INFO_COMPLETED_AT: "rent_info_completed_at",
  MANUAL_RATIO: "rents.child.children.manual_ratio",
  MANUAL_RATIO_PREVIOUS: "rents.child.children.manual_ratio_previous",
  NOTE: "rents.child.children.note",
  START_DATE: "rents.child.children.start_date",
  TYPE: "rents.child.children.type",
  X_VALUE: "rents.child.children.x_value",
  Y_VALUE: "rents.child.children.y_value",
  YEARLY_DUE_DATES: "rents.child.children.yearly_due_dates",
  Y_VALUE_START: "rents.child.children.y_value_start",
  OVERRIDE_RECEIVABLE_TYPE: "rents.child.children.override_receivable_type",
  OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX:
    "rents.child.children.old_dwellings_in_housing_companies_price_index",
  PERIODIC_RENT_ADJUSTMENT_TYPE:
    "rents.child.children.periodic_rent_adjustment_type",
};

/**
 * Lease rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentsFieldTitles = {
  RENTS: "Vuokrat",
  AMOUNT: "Kertakaikkinen vuokra",
  CYCLE: "Vuokrakausi",
  DUE_DATES_PER_YEAR: "Laskut kpl/v",
  DUE_DATES_TYPE: "Laskutusjako",
  ELEMENTARY_INDEX: "Perusindeksi",
  END_DATE: "Loppupvm",
  EQUALIZATION_END_DATE: "Tasaus loppupvm",
  EQUALIZATION_START_DATE: "Tasaus alkupvm",
  INDEX_ROUNDING: "Pyöristys",
  INDEX_TYPE: "Indeksin tunnusnumero",
  RENT_INFO_COMPLETED_AT: "Vuokratiedot kunnossa?",
  MANUAL_RATIO: "Käsinlaskentakerroin",
  MANUAL_RATIO_PREVIOUS: "Käsinlaskentakerroin (edellinen)",
  NOTE: "Huomautus",
  START_DATE: "Alkupvm",
  TYPE: "Vuokralaji",
  X_VALUE: "X-luku",
  Y_VALUE: "Y-luku",
  Y_VALUE_START: "Y-luku alkaen",
  YEARLY_DUE_DATES: "Eräpäivät (pv.kk)",
  OVERRIDE_RECEIVABLE_TYPE: "Automaattinen saamislaji",
};

/**
 * Lease rent due dates field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentDueDatesFieldPaths = {
  DUE_DATES: "rents.child.children.due_dates",
  DAY: "rents.child.children.due_dates.child.children.day",
  MONTH: "rents.child.children.due_dates.child.children.month",
};

/**
 * Lease rent due dates field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentDueDatesFieldTitles = {
  DUE_DATES: "Eräpäivät",
  DAY: "Päivä",
  MONTH: "Kuukausi",
};

/**
 * Lease rent old dwellings in housing companies price index field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldPaths = {
  POINT_FIGURES:
    "rents.child.children.old_dwellings_in_housing_companies_price_index.point_figures",
  // The following two are for the UI data purposes only
  START_DATE:
    "rents.child.children.old_dwellings_in_housing_companies_price_index.start_date",
  REVIEW_DAYS:
    "rents.child.children.old_dwellings_in_housing_companies_price_index.review_days",
};

/**
 * Lease rent old dwellings in housing companies price index field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles = {
  OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX: "Tasotarkistus",
  TYPE: "Tyyppi",
  POINT_FIGURES: "Indeksipisteluku",
  REVIEW_DAYS: "Tarkistuspäivät",
};

/**
 * Lease rent fixed initial year rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentFixedInitialYearRentsFieldPaths = {
  FIXED_INITIAL_YEAR_RENTS: "rents.child.children.fixed_initial_year_rents",
  AMOUNT: "rents.child.children.fixed_initial_year_rents.child.children.amount",
  END_DATE:
    "rents.child.children.fixed_initial_year_rents.child.children.end_date",
  INTENDED_USE:
    "rents.child.children.fixed_initial_year_rents.child.children.intended_use",
  START_DATE:
    "rents.child.children.fixed_initial_year_rents.child.children.start_date",
};

/**
 * Lease rent fixed initial year rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentFixedInitialYearRentsFieldTitles = {
  FIXED_INITIAL_YEAR_RENTS: "Kiinteä alkuvuosivuokra",
  AMOUNT: "Kiinteä alkuvuosivuokra",
  END_DATE: "Loppupvm",
  INTENDED_USE: "Käyttötarkoitus",
  START_DATE: "Alkupvm",
};

/**
 * Lease rent contract rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentContractRentsFieldPaths = {
  CONTRACT_RENTS: "rents.child.children.contract_rents",
  AMOUNT: "rents.child.children.contract_rents.child.children.amount",
  AMOUNT_FIXED_RENT:
    "rents.child.children.contract_rents.child.children.amount_fixed_rent",
  PERIOD: "rents.child.children.contract_rents.child.children.period",
  BASE_AMOUNT: "rents.child.children.contract_rents.child.children.base_amount",
  BASE_AMOUNT_PERIOD:
    "rents.child.children.contract_rents.child.children.base_amount_period",
  BASE_YEAR_RENT:
    "rents.child.children.contract_rents.child.children.base_year_rent",
  END_DATE: "rents.child.children.contract_rents.child.children.end_date",
  INDEX: "rents.child.children.contract_rents.child.children.index",
  INTENDED_USE:
    "rents.child.children.contract_rents.child.children.intended_use",
  START_DATE: "rents.child.children.contract_rents.child.children.start_date",
};

/**
 * Lease rent contract rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentContractRentsFieldTitles = {
  CONTRACT_RENTS: "Sopimusvuokra",
  AMOUNT: "Perusvuosivuokra",
  AMOUNT_FIXED_RENT: "Sopimusvuokra",
  AMOUNT_INITIAL_YEAR_RENT: "Alkuvuosivuokra",
  PERIOD: "Yksikkö",
  BASE_AMOUNT: "Vuokranlaskennan perusteena oleva vuokra",
  BASE_AMOUNT_PERIOD: "Yksikkö",
  BASE_YEAR_RENT: "Uusi perusvuosivuokra",
  END_DATE: "Loppupvm",
  INDEX: "Indeksi",
  INTENDED_USE: "Käyttötarkoitus",
  START_DATE: "Alkupvm",
};

/**
 * Lease index adjusted rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseIndexAdjustedRentsFieldPaths = {
  INDEX_ADJUSTED_RENTS: "rents.child.children.index_adjusted_rents",
  AMOUNT: "rents.child.children.index_adjusted_rents.child.children.amount",
  END_DATE: "rents.child.children.index_adjusted_rents.child.children.end_date",
  FACTOR: "rents.child.children.index_adjusted_rents.child.children.factor",
  INTENDED_USE:
    "rents.child.children.index_adjusted_rents.child.children.intended_use",
  START_DATE:
    "rents.child.children.index_adjusted_rents.child.children.start_date",
};

/**
 * Lease index adjusted rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseIndexAdjustedRentsFieldTitles = {
  INDEX_ADJUSTED_RENTS: "Indeksitarkistettu vuokra",
  AMOUNT: "Indeksitarkistettu vuokra",
  END_DATE: "Loppupvm",
  FACTOR: "Laskentakerroin",
  INTENDED_USE: "Käyttötarkoitus",
  START_DATE: "Alkupvm",
};

/**
 * Lease rent adjustments field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseRentAdjustmentsFieldPaths = {
  RENT_ADJUSTMENTS: "rents.child.children.rent_adjustments",
  AMOUNT_LEFT:
    "rents.child.children.rent_adjustments.child.children.amount_left",
  AMOUNT_TYPE:
    "rents.child.children.rent_adjustments.child.children.amount_type",
  DECISION: "rents.child.children.rent_adjustments.child.children.decision",
  END_DATE: "rents.child.children.rent_adjustments.child.children.end_date",
  FULL_AMOUNT:
    "rents.child.children.rent_adjustments.child.children.full_amount",
  INTENDED_USE:
    "rents.child.children.rent_adjustments.child.children.intended_use",
  NOTE: "rents.child.children.rent_adjustments.child.children.note",
  START_DATE: "rents.child.children.rent_adjustments.child.children.start_date",
  SUBVENTION_BASE_PERCENT:
    "rents.child.children.rent_adjustments.child.children.subvention_base_percent",
  SUBVENTION_GRADUATED_PERCENT:
    "rents.child.children.rent_adjustments.child.children.subvention_graduated_percent",
  SUBVENTION_RE_LEASE_DISCOUNT_PRECENT:
    "rents.child.children.rent_adjustments.child.children.subvention_re_lease_discount_precent",
  SUBVENTION_TYPE:
    "rents.child.children.rent_adjustments.child.children.subvention_type",
  TYPE: "rents.child.children.rent_adjustments.child.children.type",
};

/**
 * Lease rent adjustments field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseRentAdjustmentsFieldTitles = {
  RENT_ADJUSTMENTS: "Alennukset ja korotukset",
  AMOUNT_LEFT: "Jäljellä",
  AMOUNT_TYPE: "Määrän tyyppi",
  DECISION: "Päätös",
  END_DATE: "Loppupvm",
  FULL_AMOUNT: "Määrä",
  INTENDED_USE: "Käyttötarkoitus",
  NOTE: "Huomautus",
  START_DATE: "Alkupvm",
  SUBVENTION_BASE_PERCENT: "Perusalennus markkinavuokrasta",
  SUBVENTION_GRADUATED_PERCENT: "Porrastettu alennus",
  SUBVENTION_RE_LEASE_DISCOUNT_PRECENT: "Alennus markkinavuokrasta",
  SUBVENTION_TYPE: "Subvention tyyppi",
  TYPE: "Tyyppi",
  PERCANTAGE_BEGINNING: "Ensimmäisen vuoden alennus",
  NUMBER_OF_YEARS: "Vuosien lukumäärä",
  PERCANTAGE_FINAL: "Viimeisen vuoden alennus",
};

/**
 * Rent adjustment management subventions field paths enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentManagementSubventionsFieldPaths = {
  MANAGEMENT_SUBVENTIONS:
    "rents.child.children.rent_adjustments.child.children.management_subventions",
  MANAGEMENT:
    "rents.child.children.rent_adjustments.child.children.management_subventions.child.children.management",
  SUBVENTION_AMOUNT:
    "rents.child.children.rent_adjustments.child.children.management_subventions.child.children.subvention_amount",
};

/**
 * Rent adjustment management subventions field titles enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentManagementSubventionsFieldTitles = {
  MANAGEMENT_SUBVENTIONS: "Hallintamuodot",
  MANAGEMENT: "Hallintamuodon tyyppi",
  SUBVENTION_AMOUNT: "Subventoitu yksikköhinta",
  SUBVENTION_PERCENT: "Subventio prosentti",
};

/**
 * Rent adjustment temporary subventions field paths enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentTemporarySubventionsFieldPaths = {
  TEMPORARY_SUBVENTIONS:
    "rents.child.children.rent_adjustments.child.children.temporary_subventions",
  DESCRIPTION:
    "rents.child.children.rent_adjustments.child.children.temporary_subventions.child.children.description",
  SUBVENTION_PERCENT:
    "rents.child.children.rent_adjustments.child.children.temporary_subventions.child.children.subvention_percent",
};

/**
 * Rent adjustment temporary subventions field titles enumerable.
 *
 * @type {{}}
 */
export const RentAdjustmentTemporarySubventionsFieldTitles = {
  TEMPORARY_SUBVENTIONS: "Tilapäisalennukset",
  DESCRIPTION: "Tilapäisalennuksen tyyppi",
  SUBVENTION_PERCENT: "Tilapäisalennus %",
};

/**
 * Lease payable rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeasePayableRentsFieldPaths = {
  PAYABLE_RENTS: "rents.child.children.payable_rents",
  AMOUNT: "rents.child.children.payable_rents.child.children.amount",
  CALENDAR_YEAR_RENT:
    "rents.child.children.payable_rents.child.children.calendar_year_rent",
  DIFFERENCE_PERCENT:
    "rents.child.children.payable_rents.child.children.difference_percent",
  END_DATE: "rents.child.children.payable_rents.child.children.end_date",
  START_DATE: "rents.child.children.payable_rents.child.children.start_date",
};

/**
 * Lease payable rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeasePayableRentsFieldTitles = {
  PAYABLE_RENTS: "Perittävä vuokra",
  AMOUNT: "Perittävä vuokra",
  CALENDAR_YEAR_RENT: "Kalenterivuosivuokra",
  DIFFERENCE_PERCENT: "Nousu",
  END_DATE: "Loppupvm",
  START_DATE: "Alkupvm",
};

/**
 * Lease equalized rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseEqualizedRentsFieldPaths = {
  EQUALIZED_RENTS: "rents.child.children.equalized_rents",
  END_DATE: "rents.child.children.equalized_rents.child.children.end_date",
  EQUALIZATION_FACTOR:
    "rents.child.children.equalized_rents.child.children.equalization_factor",
  EQUALIZED_PAYABLE_AMOUNT:
    "rents.child.children.equalized_rents.child.children.equalized_payable_amount",
  PAYABLE_AMOUNT:
    "rents.child.children.equalized_rents.child.children.payable_amount",
  START_DATE: "rents.child.children.equalized_rents.child.children.start_date",
};

/**
 * Lease equalized rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseEqualizedRentsFieldTitles = {
  EQUALIZED_RENTS: "Tasatut vuokrat",
  END_DATE: "Loppupäivämäärä",
  EQUALIZATION_FACTOR: "Tasauskerroin",
  EQUALIZED_PAYABLE_AMOUNT: "Tasattu perittävä vuokra",
  PAYABLE_AMOUNT: "Perittävä vuokra",
  START_DATE: "Alkupäivämäärä",
};

/**
 * Lease basis of rents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseBasisOfRentsFieldPaths = {
  BASIS_OF_RENTS: "basis_of_rents",
  AMOUNT_PER_AREA: "basis_of_rents.child.children.amount_per_area",
  ARCHIVED_AT: "basis_of_rents.child.children.archived_at",
  ARCHIVED_NOTE: "basis_of_rents.child.children.archived_note",
  AREA: "basis_of_rents.child.children.area",
  AREA_UNIT: "basis_of_rents.child.children.area_unit",
  BASE_YEAR_RENT: "basis_of_rents.child.children.base_year_rent",
  DISCOUNT_PERCENTAGE: "basis_of_rents.child.children.discount_percentage",
  DISCOUNTED_INITIAL_YEAR_RENT:
    "basis_of_rents.child.children.discounted_intial_year_rent",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH:
    "basis_of_rents.child.children.discounted_intial_year_rent_per_month",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL:
    "basis_of_rents.child.children.discounted_intial_year_rent_per_month_total",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS:
    "basis_of_rents.child.children.discounted_intial_year_rent_per_2_months",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL:
    "basis_of_rents.child.children.discounted_intial_year_rent_per_2_months_total",
  INDEX: "basis_of_rents.child.children.index",
  INITIAL_YEAR_RENT: "basis_of_rents.child.children.intial_year_rent",
  INTENDED_USE: "basis_of_rents.child.children.intended_use",
  LOCKED_AT: "basis_of_rents.child.children.locked_at",
  PLANS_INSPECTED_AT: "basis_of_rents.child.children.plans_inspected_at",
  PROFIT_MARGIN_PERCENTAGE:
    "basis_of_rents.child.children.profit_margin_percentage",
  SUBVENTION_BASE_PERCENT:
    "basis_of_rents.child.children.subvention_base_percent",
  SUBVENTION_GRADUATED_PERCENT:
    "basis_of_rents.child.children.subvention_graduated_percent",
  SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT:
    "basis_of_rents.child.children.subvention_re_lease_discount_amount",
  SUBVENTION_RE_LEASE_DISCOUNT_PRECENT:
    "basis_of_rents.child.children.subvention_re_lease_discount_precent",
  SUBVENTION_TYPE: "basis_of_rents.child.children.subvention_type",
  UNIT_PRICE: "basis_of_rents.child.children.unit_price",
  TYPE: "basis_of_rents.child.children.type",
  ZONE: "basis_of_rents.child.children.zone",
};

/**
 * Lease basis of rents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseBasisOfRentsFieldTitles = {
  BASIS_OF_RENTS: "Vuokralaskuri",
  AREA_HEIGHT: "ala/korkeus",
  AMOUNT_PER_AREA: "Yksikköhinta (ind 100)",
  ARCHIVED_AT: "Arkistoitu",
  ARCHIVED_NOTE: "Arkitoinnin huomautus",
  AREA: "Pinta-ala",
  AREA_UNIT: "Pinta-alan yksikkö",
  BASE_YEAR_RENT: "Perusvuosivuokra (ind 100)",
  DISCOUNT_PERCENTAGE: "Lopullinen alennusprosentti",
  DISCOUNTED_INITIAL: "Subventoitu alkuvuosivuokra (ind)",
  SUBVENTION_DISCOUNT_PERCENTAGE: "Subventioprosentti",
  TEMPORARY_DISCOUNT_PERCENTAGE: "Tilapäisalennuksen prosentti",
  DISCOUNTED_INITIAL_YEAR_RENT:
    "Subventoitu ja alennettu alkuvuosivuokra (ind)",
  DISCOUNTED_INITIAL_YEAR_RENT_TOTAL:
    "Alennettu alkuvuosivuokra (ind) yhteensä",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH: "1 kk vuokra",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL: "1 kk vuokra yhteensä",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS: "2 kk vuokra",
  DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL: "2 kk vuokra yhteensä",
  INDEX: "Indeksi",
  INITIAL_YEAR_RENT: "Alkuvuosivuokra (ind)",
  INITIAL_YEAR_RENT_TOTAL: "Alkuvuosivuokra (ind) yhteensä",
  INTENDED_USE: "Käyttötarkoitus",
  LOCKED_AT: "Laskuri lukittu",
  PLANS_INSPECTED_AT: "Piirustukset tarkastettu",
  PRICE: "Hinta",
  PROFIT_MARGIN_PERCENTAGE: "Tuottoprosentti",
  RENT: "Vuokra",
  RENT_PER_YEAR: "Vuokra/vuosi",
  RENT_PER_MONTH: "Vuokra/kk",
  SUBVENTION_BASE_PERCENT: "Markkinavuokran subventio",
  SUBVENTION_GRADUATED_PERCENT: "Siirtymäajan subventio",
  SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT: "Subventio euroa/vuosi",
  SUBVENTION_RE_LEASE_DISCOUNT_PRECENT: "Subventio prosentteina",
  SUBVENTION_TYPE: "Subvention tyyppi",
  UNIT_PRICE: "Yksikköhinta (ind)",
  ZONE: "Vyöhyke",
};

/**
 * Basis of rent management subventions field paths enumerable.
 *
 * @type {{}}
 */
export const BasisOfRentManagementSubventionsFieldPaths = {
  MANAGEMENT_SUBVENTIONS:
    "basis_of_rents.child.children.management_subventions",
  MANAGEMENT:
    "basis_of_rents.child.children.management_subventions.child.children.management",
  SUBVENTION_AMOUNT:
    "basis_of_rents.child.children.management_subventions.child.children.subvention_amount",
};

/**
 * Basis of rent management subventions field titles enumerable.
 *
 * @type {{}}
 */
export const BasisOfRentManagementSubventionsFieldTitles = {
  MANAGEMENT_SUBVENTIONS: "Hallintamuodot",
  MANAGEMENT: "Hallintamuodon tyyppi",
  SUBVENTION_AMOUNT: "Subventoitu yksikköhinta",
  SUBVENTION_PERCENT: "Subventio prosentteina",
  SUBVENTION_AMOUNT_YEAR: "Subventio euroina/vuosi",
};

/**
 * Basis of rent temporary subventions field paths enumerable.
 *
 * @type {{}}
 */
export const BasisOfRentTemporarySubventionsFieldPaths = {
  TEMPORARY_SUBVENTIONS: "basis_of_rents.child.children.temporary_subventions",
  DESCRIPTION:
    "basis_of_rents.child.children.temporary_subventions.child.children.description",
  SUBVENTION_AMOUNT:
    "basis_of_rents.child.children.temporary_subventions.child.children.subvention_amount",
  SUBVENTION_PERCENT:
    "basis_of_rents.child.children.temporary_subventions.child.children.subvention_percent",
};

/**
 * Basis of rent temporary subventions field titles enumerable.
 *
 * @type {{}}
 */
export const BasisOfRentTemporarySubventionsFieldTitles = {
  TEMPORARY_SUBVENTIONS: "Tilapäisalennukset",
  DESCRIPTION: "Tilapäisalennuksen tyyppi",
  SUBVENTION_AMOUNT: "Alennus euroa/vuosi",
  SUBVENTION_PERCENT: "Alennus subventoidusta alkuvuosivuokrasta",
};

/**
 * Lease decisions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionsFieldPaths = {
  DEBT_COLLECTION_DECISIONS: "debt_collection_decisions",
  DECISIONS: "decisions",
  DECISION_DATE: "decisions.child.children.decision_date",
  DECISION_MAKER: "decisions.child.children.decision_maker",
  DESCRIPTION: "decisions.child.children.description",
  REFERENCE_NUMBER: "decisions.child.children.reference_number",
  SECTION: "decisions.child.children.section",
  TYPE: "decisions.child.children.type",
};

/**
 * Lease decisions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionsFieldTitles = {
  DEBT_COLLECTION_DECISIONS: "Vuokrauksen purkamispäätös",
  DECISIONS: "Päätökset",
  DECISION_DATE: "Päätöspvm",
  DECISION_MAKER: "Päättäjä",
  DESCRIPTION: "Huomautus",
  REFERENCE_NUMBER: "Diaarinumero",
  SECTION: "Pykälä",
  TYPE: "Päätöksen tyyppi",
};

/**
 * Lease decision conditions field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionConditionsFieldPaths = {
  CONDITIONS: "decisions.child.children.conditions",
  DESCRIPTION: "decisions.child.children.conditions.child.children.description",
  SUPERVISED_DATE:
    "decisions.child.children.conditions.child.children.supervised_date",
  SUPERVISION_DATE:
    "decisions.child.children.conditions.child.children.supervision_date",
  TYPE: "decisions.child.children.conditions.child.children.type",
};

/**
 * Lease decision conditions field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseDecisionConditionsFieldTitles = {
  CONDITIONS: "Ehdot",
  DESCRIPTION: "Huomautus",
  SUPERVISED_DATE: "Valvottu pvm",
  SUPERVISION_DATE: "Valvontapvm",
  TYPE: "Ehtotyyppi",
};

/**
 * Lease contracts field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractsFieldPaths = {
  CONTRACTS: "contracts",
  CONTRACT_NUMBER: "contracts.child.children.contract_number",
  DECISION: "contracts.child.children.decision",
  FIRST_CALL_SENT: "contracts.child.children.first_call_sent",
  INSTITUTION_IDENTIFIER: "contracts.child.children.institution_identifier",
  IS_READJUSTMENT_DECISION: "contracts.child.children.is_readjustment_decision",
  KTJ_LINK: "contracts.child.children.ktj_link",
  SECOND_CALL_SENT: "contracts.child.children.second_call_sent",
  SIGN_BY_DATE: "contracts.child.children.sign_by_date",
  SIGNING_DATE: "contracts.child.children.signing_date",
  SIGNING_NOTE: "contracts.child.children.signing_note",
  THIRD_CALL_SENT: "contracts.child.children.third_call_sent",
  TYPE: "contracts.child.children.type",
  EXECUTOR: "contracts.child.children.executor",
};

/**
 * Lease contracts field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractsFieldTitles = {
  CONTRACTS: "Sopimukset",
  CONTRACT_NUMBER: "Sopimusnumero",
  DECISION: "Päätös",
  FIRST_CALL_SENT: "1. kutsu lähetetty",
  INSTITUTION_IDENTIFIER: "Laitostunnus",
  IS_READJUSTMENT_DECISION: "Järjestelypäätös",
  KTJ_LINK: "Ktj dokumentti",
  ENCUMBRANCE: "Rasitustodistus",
  SECOND_CALL_SENT: "2. kutsu lähetetty",
  SIGN_BY_DATE: "Allekirjoitettava mennessä",
  SIGNING_DATE: "Allekirjoituspvm",
  SIGNING_NOTE: "Huomautus",
  THIRD_CALL_SENT: "3. kutsu lähetetty",
  TYPE: "Sopimuksen tyyppi",
  EXECUTOR: "Toimeenpanija",
};

/**
 * Lease contract mortgage documents field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractCollateralsFieldPaths = {
  COLLATRALS: "contracts.child.children.collaterals",
  DEED_DATE: "contracts.child.children.collaterals.child.children.deed_date",
  END_DATE: "contracts.child.children.collaterals.child.children.end_date",
  NOTE: "contracts.child.children.collaterals.child.children.note",
  NUMBER: "contracts.child.children.collaterals.child.children.number",
  NUMBER_MORTGAGE_DOCUMENT:
    "contracts.child.children.collaterals.child.children.number_mortgage_document",
  OTHER_TYPE: "contracts.child.children.collaterals.child.children.other_type",
  PAID_DATE: "contracts.child.children.collaterals.child.children.paid_date",
  RETURNED_DATE:
    "contracts.child.children.collaterals.child.children.returned_date",
  START_DATE: "contracts.child.children.collaterals.child.children.start_date",
  TOTAL_AMOUNT:
    "contracts.child.children.collaterals.child.children.total_amount",
  TYPE: "contracts.child.children.collaterals.child.children.type",
};

/**
 * Lease contract mortgage documents field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractCollateralsFieldTitles = {
  COLLATRALS: "Vakuudet",
  DEED_DATE: "Panttikirjan pvm",
  END_DATE: "Vakuuden loppupvm",
  NOTE: "Huomautus",
  NUMBER: "Vuokravakuusnro",
  NUMBER_MORTGAGE_DOCUMENT: "Panttikirjan numero",
  OTHER_TYPE: "Vakuuden laji",
  PAID_DATE: "Maksettu pvm",
  RETURNED_DATE: "Palautettu pvm",
  START_DATE: "Vakuuden alkupvm",
  TOTAL_AMOUNT: "Vakuuden määrä",
  TYPE: "Vakuuden tyyppi",
};

/**
 * Lease contract changes field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseContractChangesFieldPaths = {
  CONTRACT_CHANGES: "contracts.child.children.contract_changes",
  DESCRIPTION:
    "contracts.child.children.contract_changes.child.children.description",
  DECISION: "contracts.child.children.contract_changes.child.children.decision",
  FIRST_CALL_SENT:
    "contracts.child.children.contract_changes.child.children.first_call_sent",
  SECOND_CALL_SENT:
    "contracts.child.children.contract_changes.child.children.second_call_sent",
  SIGN_BY_DATE:
    "contracts.child.children.contract_changes.child.children.sign_by_date",
  SIGNING_DATE:
    "contracts.child.children.contract_changes.child.children.signing_date",
  THIRD_CALL_SENT:
    "contracts.child.children.contract_changes.child.children.third_call_sent",
  EXECUTOR:
    "contracts.child.children.contract_changes.child.children.executor",
};

/**
 * Lease contract changes field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseContractChangesFieldTitles = {
  CONTRACT_CHANGES: "Sopimuksen muutokset",
  DESCRIPTION: "Huomautus",
  DECISION: "Päätös",
  FIRST_CALL_SENT: "1. kutsu lähetetty",
  SECOND_CALL_SENT: "2. kutsu lähetetty",
  SIGN_BY_DATE: "Allekirjoitettava mennessä",
  SIGNING_DATE: "Allekirjoituspvm",
  THIRD_CALL_SENT: "3. kutsu lähetetty",
  EXECUTOR: "Toimeenpanija",
};

/**
 * Lease inspection field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionsFieldPaths = {
  INSPECTIONS: "inspections",
  DESCRIPTION: "inspections.child.children.description",
  INSPECTOR: "inspections.child.children.inspector",
  SUPERVISED_DATE: "inspections.child.children.supervised_date",
  SUPERVISION_DATE: "inspections.child.children.supervision_date",
};

/**
 * Lease inspections field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionsFieldTitles = {
  INSPECTIONS: "Tarkastukset ja huomautukset",
  DESCRIPTION: "Huomautus",
  INSPECTOR: "Tarkastaja",
  SUPERVISED_DATE: "Valvottu pvm",
  SUPERVISION_DATE: "Valvontapvm",
};

/**
 * Lease area attachments field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionAttachmentsFieldPaths = {
  ATTACHMENTS: "inspections.child.children.attachments",
  FILE: "inspections.child.children.attachments.child.children.file",
  UPLOADED_AT:
    "inspections.child.children.attachments.child.children.uploaded_at",
  UPLOADER: "inspections.child.children.attachments.child.children.uploader",
};

/**
 * Lease area attachments field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInspectionAttachmentsFieldTitles = {
  ATTACHMENTS: "Tiedostot",
  FILE: "Nimi",
  UPLOADED_AT: "Pvm",
  UPLOADER: "Lataaja",
};

/**
 * Lease invoicing field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoicingFieldPaths = {
  DEBT_COLLECTION: "debt_collection",
  INVOICES: "invoices",
  INVOICING: "invoicing",
  INVOICING_ENABLED_AT: "invoicing_enabled_at",
  PREVIEW_INVOICES: "preview_invoices",
};

/**
 * Lease invoicing field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoicingFieldTitles = {
  DEBT_COLLECTION: "Perintä",
  INVOICES: "Laskut",
  INVOICING: "Laskutus",
  INVOICING_DISABLED: "Laskutus ei käynnissä",
  INVOICING_ENABLED: "Laskutus käynnissä",
  INVOICING_INCOMPLETE_INFO: "Tiedot keskeneräiset",
  PREVIEW_INVOICES: "Laskujen esikatselu",
};

/**
 * Lease invoice notes field paths enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoiceNotesFieldPaths = {
  INVOICE_NOTES: "invoice_notes",
};

/**
 * Lease invoice notes field titles enumerable.
 *
 * @type {{}}
 */
export const LeaseInvoiceNotesFieldTitles = {
  INVOICE_NOTES: "Laskujen tiedotteet",
};

/**
 * calculator type options
 *
 * @type {{}}
 */
export const calculatorTypeOptions = [
  {
    value: "lease2022",
    label: "Vuokra",
  },
  {
    value: "lease",
    label: "Vuokra (Vanha)",
  },
  {
    value: "temporary",
    label: "Tilapäiset",
  },
  {
    value: "additional_yard",
    label: "Lisäpihat",
  },
  {
    value: "field",
    label: "Pelto",
  },
  {
    value: "mast",
    label: "Mastot",
  },
  {
    value: "device cabinet",
    label: "Laitekaappi",
  },
];

export const periodicRentAdjustmentTypes = {
  TASOTARKISTUS_20_20: "Tasotarkistus 20v/20v",
  TASOTARKISTUS_20_10: "Tasotarkistus 20v/10v",
};

export const oldDwellingsInHousingCompaniesPriceIndexTypeOptions = {
  TASOTARKISTUS_20_20: "TASOTARKISTUS_20_20",
  TASOTARKISTUS_20_10: "TASOTARKISTUS_20_10",
};
