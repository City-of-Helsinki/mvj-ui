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
import type { SavedApplicationFormSection } from "@/application/types";
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
