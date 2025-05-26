import isArray from "lodash/isArray";
import get from "lodash/get";
import { formValueSelector, getFormValues } from "redux-form";
import { FormNames, TableSortOrder } from "@/enums";
import { APPLICANT_MAIN_IDENTIFIERS } from "@/application/constants";
import { getUserFullName } from "@/users/helpers";
import { store } from "@/index";
import { getCurrentAreaSearch } from "@/areaSearch/selectors";
import { prepareApplicationForSubmission } from "@/application/helpers";
import type { LeafletFeature, LeafletGeoJson } from "types";
import type {
  FormSection,
  SavedApplicationFormSection,
} from "@/application/types";
import type { Contact } from "@/contacts/types";
import {
  ApplicantInfoSectionIdentifiers,
  ApplicantTypeSectionToContactTypeEnum,
  MapFormAnswerFieldsToContactFields,
  MapLanguageNameToCodeEnum,
} from "@/areaSearch/enums";
import { EMPTY_DEFAULT_FIELD } from "@/areaSearch/constants";
import type { HandleShowContactModal } from "@/areaSearch/types";
import { ContactTypes } from "@/contacts/enums";

export const areaSearchSearchFilters = (
  query: Record<string, any>,
): Record<string, any> => {
  const searchQuery = { ...query };
  searchQuery.state = isArray(searchQuery.state)
    ? searchQuery.state
    : searchQuery.state
      ? [searchQuery.state]
      : [];

  if (searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};

/**
 * Get application target features for geojson data
 * @param {Object[]} searches
 * @returns {Object[]}
 */
export const getAreaSearchFeatures = (
  searches: Array<Record<string, any>>,
): Array<LeafletFeature> => {
  const features = [];
  searches.forEach((search) => {
    const coords = get(search, "geometry.coordinates", []);

    if (!coords.length) {
      return;
    }

    features.push({
      type: "Feature",
      geometry: { ...search.geometry },
      properties: {
        id: search.id,
        search,
        feature_type: "areaSearch",
      },
    });
  });
  return features;
};

/**
 * Get application target geojson data
 * @param {Object[]} searches
 * @returns {Object}
 */
export const getAreaSearchGeoJson = (
  searches: Array<Record<string, any>>,
): LeafletGeoJson => {
  const features = getAreaSearchFeatures(searches);
  return {
    type: "FeatureCollection",
    features: features,
  };
};
export const getInitialAreaSearchEditForm = (
  areaSearch: Record<string, any>,
): Record<string, any> => {
  return {
    id: areaSearch.id,
    preparer: areaSearch.preparer
      ? {
          label: getUserFullName(areaSearch.preparer),
          value: areaSearch.preparer.id,
        }
      : null,
    state: areaSearch.state || null,
    lessor: areaSearch.lessor || null,
    decline_reason: areaSearch.area_search_status?.decline_reason || null,
    status_note: areaSearch.area_search_status?.status_note || "",
    preparer_note: areaSearch.area_search_status?.preparer_note || "",
  };
};
export const transformApplicantInfoCheckTitle = (
  answer: SavedApplicationFormSection,
): string => {
  if (answer?.metadata?.identifier) {
    if (answer?.metadata?.applicantType) {
      const identifiers =
        APPLICANT_MAIN_IDENTIFIERS[String(answer?.metadata?.applicantType)];
      const sectionsWithIdentifier = answer.sections[identifiers?.DATA_SECTION];
      const sectionWithIdentifier =
        sectionsWithIdentifier instanceof Array
          ? sectionsWithIdentifier[0]
          : sectionsWithIdentifier;
      const typeText = identifiers?.LABEL || "Hakija";
      const nameText =
        identifiers?.NAME_FIELDS?.map((field) => {
          return sectionWithIdentifier.fields[field]?.value || "";
        }).join(" ") || "-";
      return `${nameText}, ${typeText}`;
    }
  }

  return "Hakija";
};
export const prepareAreaSearchForSubmission = (
  data: Record<string, any>,
): Record<string, any> => {
  return {
    id: data.id,
    state: data.state,
    lessor: data.lessor,
    preparer: data.preparer?.value || null,
    area_search_status: {
      decline_reason: data.decline_reason,
      status_notes: data.status_notes
        ? [
            {
              note: data.status_notes,
            },
          ]
        : undefined,
      preparer_note: data.preparer_note,
    },
  };
};
export const getInitialAreaSearchCreateForm = (): Record<string, any> => {
  return {
    intended_use: null,
    start_date: null,
    end_date: null,
    geometry: null,
    description_area: "",
    description_intended_use: "",
  };
};
export const getSectionTemplate = (identifier: string): Record<string, any> => {
  const state = store.getState();
  const templates = formValueSelector(FormNames.AREA_SEARCH_CREATE_SPECS)(
    state,
    "form.sectionTemplates",
  );
  return templates[identifier] || {};
};
export const prepareAreaSearchDataForSubmission = (): Record<
  string,
  any
> | null => {
  const state = store.getState();
  const specValues = getFormValues(FormNames.AREA_SEARCH_CREATE_SPECS)(state);
  const applicationValues = getFormValues(FormNames.AREA_SEARCH_CREATE_FORM)(
    state,
  );
  const savedAreaSearch = getCurrentAreaSearch(state);
  const sections = applicationValues.form.sections;
  const currentAreaSearch = getCurrentAreaSearch(state);
  const applicationData = prepareApplicationForSubmission(sections);

  if (!applicationData) {
    return null;
  }

  return {
    specs: {
      ...specValues,
      id: savedAreaSearch.id,
      area_search_status: {
        decline_reason: null,
        preparer_note: "",
      },
    },
    application: {
      form: currentAreaSearch.form.id,
      entries: {
        sections: applicationData,
      },
      attachments: applicationValues.form.attachments,
      area_search: currentAreaSearch.id,
    },
  };
};

const getAddressProtection = (
  addressProtection: string | undefined | null,
): boolean | null => {
  if (!addressProtection) {
    return false;
  }
  switch (addressProtection.toLowerCase()) {
    case "kyllä":
      return true;
    case "ei":
      return false;
    default:
      return false;
  }
};

const getContactType = (
  sectionIdentifier: FormSection["identifier"],
  contactType: Contact["type"],
): Contact["type"] => {
  const { BILL_RECIPIENT, CONTACT_PERSON } = ApplicantInfoSectionIdentifiers;

  // includes method is used to match the contact person section identifier
  // because a typical contact person section identifier: "yhteyshenkilo-1"
  // doesn't match the CONTACT_PERSON string exactly
  if (sectionIdentifier.includes(CONTACT_PERSON)) {
    return ContactTypes.PERSON;
  }

  if (sectionIdentifier === BILL_RECIPIENT) {
    return ContactTypes.BUSINESS;
  }

  return contactType;
};

export const getContactFromAnswerFields = (
  contactType: Contact["type"],
  sectionIdentifier: FormSection["identifier"],
  answerSection: SavedApplicationFormSection,
): Partial<Contact> => {
  if (!answerSection || !answerSection?.fields) {
    return null;
  }
  const contact: Partial<Contact> = {};
  const answerFields = answerSection.fields;

  for (const key in MapFormAnswerFieldsToContactFields) {
    const value = get(
      answerFields,
      MapFormAnswerFieldsToContactFields[key],
      EMPTY_DEFAULT_FIELD,
    )?.value;

    const { address_protection, c_o, country, language, postal_code } =
      MapFormAnswerFieldsToContactFields;

    switch (MapFormAnswerFieldsToContactFields[key]) {
      case address_protection: {
        contact.address_protection = getAddressProtection(value);
        break;
      }
      case country: {
        contact.country = value?.toLowerCase() === "suomi" ? "FI" : null;
        break;
      }
      case c_o: {
        contact.care_of = value ? String(value) : null;
        break;
      }
      case language: {
        contact.language = value ? MapLanguageNameToCodeEnum[value] : null;
        break;
      }
      case postal_code: {
        contact.postal_code = value ? String(value) : null;
        break;
      }
      default: {
        contact[key] = value;
        break;
      }
    }
  }
  contact.type = getContactType(sectionIdentifier, contactType);
  contact.is_lessor = false;
  return contact;
};

/**
 * Determine if the create contact button should be visible
 * based on the section type and the answer section.
 * @param handleShowContactModal
 * @param section
 * @param answerSection
 * @returns
 */
export const getIsCreateContactButtonVisible = (
  handleShowContactModal: HandleShowContactModal | undefined,
  section: FormSection,
  answerSection: SavedApplicationFormSection,
): boolean => {
  const sectionIsContactPerson = section.identifier.includes(
    ApplicantInfoSectionIdentifiers.CONTACT_PERSON,
  );

  const sectionIsBillRecipient =
    section.identifier === ApplicantInfoSectionIdentifiers.BILL_RECIPIENT;

  const otherThanApplicantActive =
    answerSection.fields["eri-kuin-hakija"]?.value === true;

  const sectionIsMainApplicantInfoSection =
    section.identifier === ApplicantInfoSectionIdentifiers.PERSON_INFO ||
    section.identifier === ApplicantInfoSectionIdentifiers.COMPANY_INFO;

  const isEligibleSection =
    sectionIsMainApplicantInfoSection ||
    ((sectionIsContactPerson || sectionIsBillRecipient) &&
      otherThanApplicantActive);

  return !!handleShowContactModal && isEligibleSection;
};

/**
 * Section is hidden if it is a contact person ("yhteyshenkilo-NUMBER")
 * or bill recipient ("laskunsaaja") and it is not
 * marked as other than applicant ("eri-kuin-hakija").
 * @param section
 * @param answerSection
 * @returns
 */
export const getIsConditionallyHiddenSection = (
  section: FormSection,
  answerSection:
    | SavedApplicationFormSection
    | Array<SavedApplicationFormSection>,
): boolean => {
  if (isArray(answerSection)) {
    return false;
  }

  const sectionIsContactPerson = (section.identifier || "").includes(
    ApplicantInfoSectionIdentifiers.CONTACT_PERSON,
  );

  const sectionIsBillRecipient =
    section.identifier === ApplicantInfoSectionIdentifiers.BILL_RECIPIENT;

  const otherThanApplicantActive =
    answerSection.fields["eri-kuin-hakija"]?.value === true;

  return (
    (sectionIsContactPerson || sectionIsBillRecipient) &&
    !otherThanApplicantActive
  );
};

export const getContactTypeString = (
  sectionIdentifier: string,
): Contact["type"] | null => {
  return ApplicantTypeSectionToContactTypeEnum[sectionIdentifier] || null;
};
