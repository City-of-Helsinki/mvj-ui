// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {getContentUser} from '$src/users/helpers';
import type {PlotSearch, Form} from './types';
import {removeSessionStorageItem} from '$util/storage';
import {FormNames} from '$src/enums';
import {
  getApiResponseResults,
} from '$util/helpers';

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
    preparer: getContentUser(plotSearch.preparer),
    stage: get(plotSearch.stage, 'id'),
    subtype: get(plotSearch.subtype, 'id'),
    type: get(plotSearch.type, 'id'),
    targets: plotSearch.targets,
    /* applications: plotSearch.applications,
    step: plotSearch.step,
    start_time: plotSearch.start_time,
    end_time: plotSearch.end_time,
    last_update: plotSearch.last_update,
    plotSearch_sites: getContentSearchProperties(plotSearch.plotSearch_sites),
    decisions: plotSearch.decisions, */
  };
};

/**
 * Get basic information form values
 * @param {Object} basicInformation
 * @return {Object}
 */
export const getBasicInformationFormValues = (basicInformation: Object): Object => {
  let values = basicInformation;
  values.preparer = get(basicInformation.preparer, 'id');
  values.stage = get(basicInformation.stage, 'id');
  values.subtype = get(basicInformation.subtype, 'id');
  values.type = get(basicInformation.type, 'id');
  return values;
};

/**
 * Get plotSearch application content
 * @param {Object} plotSearch
 * @param {Object} plotSearchForm
 * @return {Object}
 */
export const getContentApplication = (plotSearch: PlotSearch, plotSearchForm: Form): Object => {
  return {
    template: null,
    useExistingForm: !!plotSearch.form ? "1" : "0",
    form: plotSearchForm
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
 * @param {Object} contract
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
    ? `${get(plan_unit, 'identifier')} ${get(plan_unit, 'plan_unit_status')} ${get(plan_unit, 'lease_identifier')}`
    : null;
};

/**
 * Get plotSearch list results
 * @param {Object} plotSearch
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

/**
 * Get label
 * @param {Object} plan_unit
 * @returns {string}
 */
export const getlabel = (plan_unit: Object): ?string =>
  !isEmpty(plan_unit)
    ? `${get(plan_unit, 'label')}`
    : null;


export const getPlanUnitFromObjectKeys = (planUnit: Object, index: any): ?Object => {
  if(planUnit && Object.keys(planUnit) && planUnit[Object.keys(planUnit)[index]])
    return planUnit[Object.keys(planUnit)[index]];
  else
    return null;
};

/**
 * clean targets
 * @param {Object} plan_unit
 * @returns {Object}
 */
export const cleanTargets = (payload: Object): Object => {
  const targets = payload.targets.map(target => ({
    plan_unit_id: target.plan_unit_id,
    target_type: target.target_type,
  }));
  return payload = {...payload, targets: targets};
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
  const filteredSubTypes = subTypes.filter(subType => subType.plot_search_type === type);
  const subTypesAsOptions = filteredSubTypes.map(subType => ({
    value: subType.id,
    label: subType.name,
  }));
  return subTypesAsOptions;
};
