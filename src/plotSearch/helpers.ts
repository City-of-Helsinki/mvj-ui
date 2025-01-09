import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { kebabCase } from "lodash/string";
import { cloneDeep } from "lodash/lang";
import { formValueSelector } from "redux-form";
import { getContentUser } from "@/users/helpers";
import { removeSessionStorageItem } from "@/util/storage";
import { FormNames } from "@/enums";
import { formatDate, getApiResponseResults } from "@/util/helpers";
import { PlotSearchTargetType } from "@/plotSearch/enums";
import {
  FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME,
  FieldTypeFeatures,
  PROTECTED_FORM_PATHS,
} from "@/plotSearch/constants";
import type {
  PlotSearch,
  PlotSearchState,
  ProtectedFormPathsSectionNode,
} from "@/plotSearch/types";
import type { Attributes } from "types";
import type { Form, FormField, FormSection } from "@/application/types";

/**
 * Get plotSearch basic information content
 * @param {Object} plotSearch
 * @return {Object}
 */
export const getContentBasicInformation = (
  plotSearch: PlotSearch,
): Record<string, any> => {
  return {
    id: plotSearch.id,
    name: plotSearch.name,
    begin_at: plotSearch.begin_at,
    created_at: plotSearch.created_at,
    deleted: plotSearch.deleted,
    end_at: plotSearch.end_at,
    modified_at: plotSearch.modified_at,
    preparers: plotSearch.preparers?.map(getContentUser),
    stage: get(plotSearch.stage, "id"),
    stageType: get(plotSearch.stage, "stage"),
    subtype: get(plotSearch.subtype, "id"),
    type: get(plotSearch.type, "id"),
    search_class: plotSearch.search_class,
    plot_search_targets: plotSearch.plot_search_targets?.map((target) => ({
      ...target,
      plan_unit_id: target.plan_unit_id,
      custom_detailed_plan_id: target.custom_detailed_plan_id,
    })),
    decisions: plotSearch.decisions?.map((decision) => {
      // Detailed target objects are not available in a search result, only when fetching a single plot search,
      // so the decisions might not always be available.
      const matchingTarget = plotSearch.plot_search_targets?.find((target) =>
        target.decisions?.find(
          (targetDecision) => targetDecision.id === decision.id,
        ),
      );
      return annotatePlanUnitDecision(decision, matchingTarget?.plan_unit);
    }),
  };
};

/**
 * Get plotSearch application content
 * @param {Object} plotSearch
 * @param {Object} plotSearchForm
 * @return {Object}
 */
export const getContentApplication = (
  plotSearch: PlotSearch,
  plotSearchForm: Form | null = null,
): Record<string, any> => {
  return {
    template: null,
    useExistingForm: plotSearch.form ? "1" : "0",
    form: plotSearchForm,
  };
};

/**
 * Get search properties
 * @param {Object} searchProperties
 * @return {Object}
 */
export const getContentSearchProperties = (
  searchProperties: Record<string, any>,
): Record<string, any> => {
  return searchProperties;
};

/**
 * Get plotSearch list item
 * @param {Object} plotSearch
 * @return {Object}
 */
export const getContentPlotSearchListItem = (
  plotSearch: PlotSearch,
): Record<string, any> => {
  return {
    id: plotSearch.id,
    basicInformation: getContentBasicInformation(plotSearch),
    application: getContentApplication(plotSearch),
    ...getContentBasicInformation(plotSearch),
  };
};

/**
 * Get content plan unit identifiers
 * @param {Object} plan_unit
 * @returns {string}
 */
export const getContentPlanUnitIdentifier = (
  plan_unit: Record<string, any>,
): string | null | undefined => {
  return !isEmpty(plan_unit)
    ? `${get(plan_unit, "identifier")} ${get(plan_unit, "plan_unit_status") || ""} ${get(plan_unit, "lease_identifier") || ""}`
    : null;
};

/**
 * Get plotSearch list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentPlotSearchListResults = (
  content: any,
): Array<Record<string, any>> =>
  getApiResponseResults(content).map((plotSearch) =>
    getContentPlotSearchListItem(plotSearch),
  );

/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.PLOT_SEARCH_APPLICATION);
  removeSessionStorageItem("plotSearchId");
  removeSessionStorageItem("plotSearchValidity");
};
export const getPlanUnitFromObjectKeys = (
  planUnit: Record<string, any>,
  index: any,
): Record<string, any> | null | undefined => {
  if (
    planUnit &&
    Object.keys(planUnit) &&
    planUnit[Object.keys(planUnit)[index]]
  )
    return planUnit[Object.keys(planUnit)[index]];
  else return null;
};

/**
 * clean targets
 * @param {Object} payload
 * @param {boolean} shouldFixTargetType
 * @returns {Object}
 */
export const cleanTargets = (
  payload: Record<string, any>,
  shouldFixTargetType: boolean,
): Record<string, any> => {
  const plot_search_targets = payload.plot_search_targets.map((target) => ({
    id: target.id,
    target_type: shouldFixTargetType
      ? PlotSearchTargetType.SEARCHABLE
      : target.target_type,
    info_links: target.info_links,
    ...(target.plan_unit_id
      ? {
          plan_unit_id: target.plan_unit_id,
        }
      : {
          custom_detailed_plan_id: target.custom_detailed_plan_id,
        }),
  }));
  return { ...payload, plot_search_targets };
};

/**
 * clean targets
 * @param {Object} payload
 * @returns {Object}
 */
export const cleanDecisions = (
  payload: Record<string, any>,
): Record<string, any> => {
  return {
    ...payload,
    decisions: payload.decisions
      .filter((decision) => !!decision.id && !!decision.relatedPlanUnitId)
      .map((decision) => decision.id),
  };
};

/**
 * filter Sub Types
 * @param {Object} subTypes
 * @param {string} type
 * @returns {Object}
 */
export const filterSubTypes = (
  subTypes: Record<string, any>,
  type: string,
): Record<string, any> => {
  if (isEmpty(subTypes)) return [];
  const filteredSubTypes = subTypes.filter(
    (subType) => subType.plot_search_type.id === type,
  );
  const subTypesAsOptions = filteredSubTypes.map((subType) => ({
    value: subType.id,
    label: subType.name,
  }));
  return subTypesAsOptions;
};
export const hasMinimumRequiredFieldsFilled = (
  state: PlotSearchState,
): boolean => {
  return ["name", "preparers", "stage", "type", "subtype"].every(
    (fieldName) =>
      !!formValueSelector(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(
        state,
        fieldName,
      ),
  );
};
export const formatDecisionName = (decision: Record<string, any>): string => {
  const textsFromFields = [
    decision.relatedPlanUnitIdentifier &&
      `(${decision.relatedPlanUnitIdentifier})`,
    decision.reference_number,
    decision.decision_maker?.name,
    formatDate(decision.decision_date),
    decision.section ? decision.section + "\u00a0§" : null,
    decision.type?.name,
    decision.conditions?.length > 0
      ? `(${decision.conditions.length} ehto${decision.conditions.length === 1 ? "" : "a"})`
      : null,
  ].filter((text) => !!text);
  return textsFromFields.join("\u00a0\u00a0");
};
export const annotatePlanUnitDecision = (
  decision: Record<string, any>,
  plotUnit: Record<string, any>,
): Record<string, any> => {
  return {
    ...decision,
    relatedPlanUnitIdentifier:
      plotUnit?.identifier || decision.relatedPlanUnitIdentifier,
    relatedPlanUnitId: plotUnit?.id || decision.relatedPlanUnitId,
  };
};
export const getInfoLinkLanguageDisplayText = (
  key: string,
  attributes: Attributes,
): string => {
  const languages = get(
    attributes,
    "plot_search_targets.child.children.info_links.child.children.language.choices",
  );
  return (
    languages?.find((language) => language.value === key)?.display_name || key
  );
};

class UniqueTemporaryIdFactory {
  i;

  constructor() {
    this.i = 0;
  }

  next() {
    this.i++;
    return "t" + this.i.toString();
  }
}

const uniqueTemporaryIdFactory = new UniqueTemporaryIdFactory();

const getUniqueTemporaryId: () => string = () =>
  uniqueTemporaryIdFactory.next();

export const getDefaultNewFormSection = (
  peerIdentifiers: Array<string>,
): Record<string, any> => ({
  temporary_id: getUniqueTemporaryId(),
  identifier: generateSectionIdentifierFromName("", peerIdentifiers),
  title: "",
  title_en: "",
  title_sv: "",
  visible: true,
  required: false,
  add_new_allowed: false,
  show_duplication_check: true,
  fields: [],
  subsections: [],
  auto_fill_identifier: true,
  is_protected: false,
});
export const getDefaultNewFormField = (
  peerIdentifiers: Array<string>,
): Record<string, any> => ({
  temporary_id: getUniqueTemporaryId(),
  identifier: generateFieldIdentifierFromName("", peerIdentifiers),
  label: "",
  label_en: "",
  label_sv: "",
  hint_text: "",
  hint_text_en: "",
  hint_text_sv: "",
  enabled: true,
  required: false,
  type: null,
  default_value: "",
  choices: [],
  auto_fill_identifier: true,
  is_protected: false,
  protected_values: [],
});
export const getInitialFormSectionEditorData = (
  fieldTypeMapping: Record<string, any>,
  section: FormSection,
): Record<string, any> => {
  const protectedPathsRoot = PROTECTED_FORM_PATHS;
  const collapseInitialState = {};

  const addUIPropertiesToField = (
    field: FormField,
    peerFieldIdentifiers: Array<string>,
    isProtected: boolean,
    protectedValues: Array<string>,
  ): Record<string, any> => {
    let defaultValue: any = field.default_value;
    const fieldFeatures =
      FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME[fieldTypeMapping[field.type]] ||
      [];
    let temporaryId;

    if (field.id) {
      collapseInitialState[`field-${field.id}`] = false;
    } else {
      temporaryId = getUniqueTemporaryId();
      collapseInitialState[`field-${temporaryId}`] = false;
    }

    if (fieldFeatures.includes(FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS)) {
      try {
        defaultValue = JSON.parse(defaultValue);

        if (
          !(defaultValue instanceof Array) &&
          !(typeof defaultValue === "boolean")
        ) {
          defaultValue = [defaultValue];
        }
      } catch {
        defaultValue = [defaultValue];
      }
    }

    return {
      ...cloneDeep(field),
      temporary_id: temporaryId,
      auto_fill_identifier:
        generateFieldIdentifierFromName(field.label, peerFieldIdentifiers) ===
        field.identifier,
      auto_fill_choice_values:
        protectedValues.length === 0 &&
        field.choices.every(
          (choice, index) => choice.value.toString() === (index + 1).toString(),
        ),
      is_protected: isProtected,
      protected_values: protectedValues,
      default_value: defaultValue,
    };
  };

  const addUIPropertiesToSection = (
    section: FormSection,
    peerSectionIdentifiers: Array<string>,
    protectedPaths: ProtectedFormPathsSectionNode,
  ): Record<string, any> => {
    const subsectionIdentifiers = section.subsections.map(
      (subsection) => subsection.identifier,
    );
    const fieldIdentifiers = section.fields.map((field) => field.identifier);
    let temporaryId;

    if (section.id) {
      collapseInitialState[`section-${section.id}`] = true;
    } else {
      temporaryId = getUniqueTemporaryId();
      collapseInitialState[`section-${temporaryId}`] = true;
    }

    return {
      ...cloneDeep(section),
      temporary_id: temporaryId,
      is_protected: !!protectedPaths.fields || !!protectedPaths.subsections,
      subsections: section.subsections.map((subsection, index) =>
        addUIPropertiesToSection(
          subsection,
          subsectionIdentifiers.filter((_, i) => i !== index),
          protectedPaths?.subsections?.[subsection.identifier] || {},
        ),
      ),
      fields: section.fields.map((field, index) =>
        addUIPropertiesToField(
          field,
          fieldIdentifiers.filter((_, i) => i !== index),
          protectedPaths?.fields?.includes(field.identifier) || false,
          protectedPaths?.fieldChoices?.[field.identifier] || [],
        ),
      ),
      auto_fill_identifier:
        generateFieldIdentifierFromName(
          section.title,
          peerSectionIdentifiers,
        ) === section.identifier,
    };
  };

  return {
    sectionData: addUIPropertiesToSection(
      section,
      [],
      protectedPathsRoot[section.identifier] || {},
    ),
    collapseInitialState,
  };
};
export const generateIdentifierFromName = (
  name: string,
  peerIdentifiers: Array<string>,
  emptyBaseName: string,
): string => {
  const baseAutoName = kebabCase(name.length > 0 ? name : emptyBaseName);
  let autoName = baseAutoName;
  let idx = 0;

  while (peerIdentifiers.includes(autoName)) {
    if (idx > 1e5) {
      throw new Error("too many fields with the same label");
    }

    ++idx;
    autoName = `${baseAutoName}-${idx}`;
  }

  return autoName;
};
export const generateSectionIdentifierFromName = (
  name: string,
  peerIdentifiers: Array<string>,
): string => generateIdentifierFromName(name, peerIdentifiers, "Uusi osio");
export const generateFieldIdentifierFromName = (
  name: string,
  peerIdentifiers: Array<string>,
): string => generateIdentifierFromName(name, peerIdentifiers, "Uusi kenttä");
export const transformCommittedFormSectionEditorData = (
  section: Record<string, any>,
): FormSection => {
  const transformChoice = (
    choice: Record<string, any>,
    index: number,
  ): Record<string, any> => {
    const { text, ...rest } = choice;
    return { ...cloneDeep(rest), sort_order: index, text, text_fi: text };
  };

  const transformField = (
    field: Record<string, any>,
    index: number,
  ): Record<string, any> => {
    const {
      // UI fields to be removed
      // eslint-disable-next-line no-unused-vars
      auto_fill_identifier,
      auto_fill_choice_values,
      is_protected,
      protected_values,
      temporary_id,
      default_value,
      choices,
      label,
      ...rest
    } = field;
    return {
      ...cloneDeep(rest),
      sort_order: index,
      choices: choices?.map(transformChoice) || null,
      default_value:
        typeof default_value === "string"
          ? default_value
          : JSON.stringify(default_value) || "",
      label,
      label_fi: label,
    };
  };

  const transformSection = (
    section: Record<string, any>,
    index: number,
  ): any => {
    const {
      // UI fields to be removed
      // eslint-disable-next-line no-unused-vars
      auto_fill_identifier,
      sort_order,
      is_protected,
      temporary_id,
      subsections,
      fields,
      label,
      help_text,
      ...rest
    } = section;
    return {
      ...cloneDeep(rest),
      subsections: subsections.map(transformSection),
      fields: fields.map(transformField),
      sort_order: index,
      label,
      help_text,
      label_fi: label,
      help_text_fi: help_text,
    };
  };

  return transformSection(section, section.sort_order);
};
