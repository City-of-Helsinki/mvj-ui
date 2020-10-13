import {
  getApiResponseResults, 
} from '$util/helpers';

/** 
 * Get plotApplication list results
 * @param {Object} plotApplication
 * @return {Object[]}
 */
export const getContentPlotApplicationsListResults = (content: Object): Array<Object> =>
  getApiResponseResults(content).map((plotApplication) => getContentApplicationListItem(plotApplication));

/** 
 * Get plotApplication list item
 * @param {Object} application
 * @return {Object}
 */
export const getContentApplicationListItem = (plotApplication: Object): Object => {
  return {
    id: plotApplication.id,
    name: plotApplication.name,
  };
};
