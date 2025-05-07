import { ContactTypes } from "@/contacts/enums";

export const ApplicantTypeSectionToContactTypeEnum = {
  'yrityksen-tiedot': ContactTypes.BUSINESS,
  'henkilon-tiedot': ContactTypes.PERSON,
}

export const AreaSearchFieldPaths = {
  INTENDED_USE: "intended_use",
  LESSOR: "lessor",
  AUDIT_LOG: "audit_log",
  AREA_SEARCH_STATUS: "area_search_status",
};
export const AreaSearchFieldTitles = {
  INTENDED_USE: "Käyttötarkoitus",
  LESSOR: "Vuokranantaja",
  STATE: "Tila",
  RECEIVED_DATE: "Saapumisajankohta",
  SETTLED_DATE: "Päätetty pvm",
  PREPARER: "Käsittelijä",
  RENT_PERIOD: "Vuokra-aika",
  DESCRIPTION_INTENDED_USE: "Käyttötarkoitus",
  DESCRIPTION_AREA: "Alueen kuvaus",
  AREA: "Pinta-ala",
  PROPERTY_IDENTIFIER: "Kiinteistötunnus",
  DECLINE_REASON: "Hylkäämisen syy",
  PREPARER_NOTE: "Käsittelytietojen huomautus",
  STATUS_NOTES: "Käsittelijän muistiinpanot",
  AUDIT_LOG: "Muutoshistoria",
  LEASE: "Vuokraus",
};

export const ApplicantInfoSectionIdentifiers = {
  PERSON_INFO: "henkilon-tiedot",
  COMPANY_INFO: "yrityksen-tiedot",
  // yhteyshenkilo should be used with regexes or includes method for matching,
  // because it includes a number at the end of the identifier
  // Example: "yhteyshenkilo-1"
  CONTACT_PERSON: "yhteyshenkilo",
  BILL_RECIPIENT: "laskunsaaja",
}

/**
 * Map form answer to contact fields enumerable.
 * @readonly
 * @enum {string}
 */
export const MapFormAnswerFieldsToContactFields = {
  first_name: "etunimi",
  last_name: "Sukunimi",
  name: "nimi",
  business_id: "y-tunnus",
  address: "katuosoite",
  postal_code: "postinumero",
  city: "postitoimipaikka",
  country: "maa",
  email: "sahkoposti",
  phone: "puhelinnumero",
  language: "kieli",
  national_identification_number: "henkilotunnus",
  address_protection: "turvakielto",
}

export const MapLanguageNameToCodeEnum = {
  suomi: "fi",
  ruotsi: "sv",
  englanti: "en",
}