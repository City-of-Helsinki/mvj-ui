// @flow
import get from 'lodash/get';

import {getContentUser} from '$src/users/helpers';
import type {PlotSearch} from './types';
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
 * @return {Object}
 */
export const getContentApplication = (plotSearch: PlotSearch): Object => {
  return {
    default: plotSearch.application_base.default,
    extra: plotSearch.application_base.extra,
    previous: plotSearch.application_base.previous,
    created: plotSearch.application_base.created,
    applicants: plotSearch.application_base.applicants,
    targets: plotSearch.application_base.targets,
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
