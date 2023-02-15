// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {getContentUser} from '$src/users/helpers';
import type {PlotSearch, Form, PlotSearchState} from './types';
import {removeSessionStorageItem} from '$util/storage';
import {FormNames} from '$src/enums';
import {
  getApiResponseResults,
} from '$util/helpers';
import {formatDate} from '../util/helpers';
import {formValueSelector} from 'redux-form';
import {PlotSearchTargetType, TargetIdentifierTypes} from './enums';
import type {Attributes} from '../types';

/**
 * Get plotSearch basic information content
 * @param {Object} plotSearch
 * @return {Object}
 */
export const getContentBasicInformation = (plotSearch: PlotSearch): Object => {
  return {
    id: plotSearch.id,
    name: plotSearch.name,
    begin_at: plotSearch.begin_at,
    created_at: plotSearch.created_at,
    deleted: plotSearch.deleted,
    end_at: plotSearch.end_at,
    modified_at: plotSearch.modified_at,
    preparers: plotSearch.preparers?.map(getContentUser),
    stage: get(plotSearch.stage, 'id'),
    subtype: get(plotSearch.subtype, 'id'),
    type: get(plotSearch.type, 'id'),
    search_class: plotSearch.search_class,
    plot_search_targets: plotSearch.plot_search_targets?.map((target) => ({
      ...target,
      plan_unit_id: target.plan_unit_id,
      custom_detailed_plan_id: target.custom_detailed_plan_id,
    })),
    decisions: plotSearch.decisions?.map((decision) => {
      // Detailed target objects are not available in a search result, only when fetching a single plot search,
      // so the decisions might not always be available.
      const matchingTarget = plotSearch.plot_search_targets?.find((target) => target.decisions?.find((targetDecision) => targetDecision.id === decision.id));
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
export const getContentApplication = (plotSearch: PlotSearch, plotSearchForm: Form | null = null): Object => {
  return {
    template: null,
    useExistingForm: plotSearch.form ? '1' : '0',
    form: plotSearchForm,
  };
};

/**
 * Get search properties
 * @param {Object} searchProperties
 * @return {Object}
 */
export const getContentSearchProperties = (searchProperties: Object): Object => {
  return searchProperties;
};

/**
 * Get plotSearch list item
 * @param {Object} plotSearch
 * @return {Object}
 */
export const getContentPlotSearchListItem = (plotSearch: PlotSearch): Object => {
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
export const getContentPlanUnitIdentifier = (plan_unit: Object): ?string =>
{
  return !isEmpty(plan_unit)
    ? `${get(plan_unit, 'identifier')} ${get(plan_unit, 'plan_unit_status') || ''} ${get(plan_unit, 'lease_identifier') || ''}`
    : null;
};

/**
 * Get plotSearch list results
 * @param {Object} content
 * @return {Object[]}
 */
export const getContentPlotSearchListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotSearch) => getContentPlotSearchListItem(plotSearch));


/**
 * Clear all unsaved changes from local storage
 */
export const clearUnsavedChanges = () => {
  removeSessionStorageItem(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
  removeSessionStorageItem(FormNames.PLOT_SEARCH_APPLICATION);
  removeSessionStorageItem('plotSearchId');
  removeSessionStorageItem('plotSearchValidity');
};


export const getPlanUnitFromObjectKeys = (planUnit: Object, index: any): ?Object => {
  if(planUnit && Object.keys(planUnit) && planUnit[Object.keys(planUnit)[index]])
    return planUnit[Object.keys(planUnit)[index]];
  else
    return null;
};

/**
 * clean targets
 * @param {Object} payload
 * @param {boolean} shouldFixTargetType
 * @returns {Object}
 */
export const cleanTargets = (payload: Object, shouldFixTargetType: boolean): Object => {
  const plot_search_targets = payload.plot_search_targets.map(target => ({
    id: target.id,
    target_type: shouldFixTargetType ? PlotSearchTargetType.SEARCHABLE : target.target_type,
    info_links: target.info_links,
    ...(target.plan_unit_id ? {plan_unit_id: target.plan_unit_id} : {custom_detailed_plan_id: target.custom_detailed_plan_id}),
  }));
  return {...payload, plot_search_targets};
};

/**
 * clean targets
 * @param {Object} payload
 * @returns {Object}
 */
export const cleanDecisions = (payload: Object): Object => {
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
export const filterSubTypes = (subTypes: Object, type: string): Object => {
  if(isEmpty(subTypes))
    return [];
  const filteredSubTypes = subTypes.filter(subType => subType.plot_search_type.id === type);
  const subTypesAsOptions = filteredSubTypes.map(subType => ({
    value: subType.id,
    label: subType.name,
  }));
  return subTypesAsOptions;
};

export const hasMinimumRequiredFieldsFilled = (state: PlotSearchState): boolean => {
  return [
    'name',
    'preparers',
    'stage',
    'type',
    'subtype',
  ].every((fieldName) => !!formValueSelector(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(state, fieldName));
};

export const formatDecisionName = (decision: Object): string => {
  const textsFromFields = [
    decision.relatedPlanUnitIdentifier && `(${decision.relatedPlanUnitIdentifier})`,
    decision.reference_number,
    decision.decision_maker?.name,
    formatDate(decision.decision_date),
    decision.section ? decision.section + '\u00a0§' : null,
    decision.type?.name,
    decision.conditions?.length > 0
      ? `(${decision.conditions.length} ehto${decision.conditions.length === 1 ? '' : 'a'})`
      : null,
  ].filter((text) => !!text);

  return textsFromFields.join('\u00a0\u00a0');
};

export const annotatePlanUnitDecision = (decision: Object, plotUnit: Object): Object => {
  return {
    ...decision,
    relatedPlanUnitIdentifier: plotUnit?.identifier || decision.relatedPlanUnitIdentifier,
    relatedPlanUnitId: plotUnit?.id || decision.relatedPlanUnitId,
  };
};

export const getInfoLinkLanguageDisplayText = (key: string, attributes: Attributes): string => {
  const languages = get(attributes, 'plot_search_targets.child.children.info_links.child.children.language.choices');
  return languages?.find((language) => language.value === key)?.display_name || key;
};

export const getTargetType = (target: Object): string | null => {
  if (target.plan_unit) {
    return TargetIdentifierTypes.PLAN_UNIT;
  }
  if (target.custom_detailed_plan) {
    return TargetIdentifierTypes.CUSTOM_DETAILED_PLAN;
  }

  return null;
};

export const getTargetTitle = (target: Object): string => {
  const targetType = getTargetType(target);

  if (targetType === TargetIdentifierTypes.PLAN_UNIT) {
    return `${target.lease_address?.address || '-'} (${target.lease_identifier})`;
  } else if (targetType === TargetIdentifierTypes.CUSTOM_DETAILED_PLAN) {
    return `${target.custom_detailed_plan?.address || '-'} (${target.custom_detailed_plan?.identifier})`;
  } else {
    return '?';
  }
};
