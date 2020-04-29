import type {Reports} from '$src/types';
import get from 'lodash/get';
import format from 'date-fns/format';

/**
 * Get report type options
 * @param {Reports} reports
 * @return {Report[]}
 */
export const getReportTypeOptions = (reports: Reports): Array<Object> => {
  if(reports)
    return Object.entries(reports).map(([key, value]) => {
      return {
        value: key,
        label: value.name,
      };
    });
  else
    return [];
};

/**
 * Get report url
 * @param {Reports} reports
 * @param {string} reportType
 * @return {Report[]}
 */
export const getReportUrl = (reports: Reports, reportType: string): string => {
  let url = '';
  if(reports)
    Object.entries(reports).map(([key, value]) => {
      if(key === reportType)
        url = value.url;
    });
  return url;
};

/**
 * Get payload
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} url
 * @param {string} leaseType
 * @param {string} invoiceState
 * @return {Object[]}
 */
export const getPayload = (query: string, url: string, reportType: string): Object => {
  return {
    url: url,
    report_type: reportType,
    query: query,
  };
};

/**
 * Get invoice state
 * @param {string} state
 */
export const getInvoiceState = (state: string): string => {
  switch(state) {
    case 'open':
      return 'Avoin';
    case 'paid':
      return 'Maksettu';
    case 'refunded':
      return 'Hyvitetty';
    default:
      return state;
  }
};

/* 
* Get fields
* @param {object} options
*/
export const getFields = (options: Object): Array => {
  return get(options, 'actions.GET');
};

/* 
* Get Query parameters
* @param {object} formValues
*/
export const getQueryParams = (formValues: Object): Array => {
  let query = '';
  if(formValues)
    Object.entries(formValues).map(([key, value]) => {
      if(key === 'start_date' || key === 'end_date'){
        query += `${key}=${format(value, 'yyyy-MM-dd')}&`;
      }
      else 
        query += `${key}=${value}&`;
    });
  return query.slice(0, -1);
};

/* 
* format date string
* @param {string} dateString
*/
export const formatDate = (dateString: string): string => {
  return dateString.split('.').reverse().join('-');
};

/**
 * Get outputfields
 * @param {Object} options
 * @return {Array[]}
 */
export const getOutputFields = (options: Object): Array<Object> => {
  if(options)
    return Object.entries(options.output_fields).map(([key, value]) => {
      return {
        key: key,
        label: value.label,
      };
    });
  else
    return [];
};

/**
 * Format type
 * @param {Object} value
 * @return {string}
 */
export const formatType = (value: Object): string => {
  return get(value, 'type').replace('Model', '').replace('Field', '').replace('Null', '').toLowerCase();
};
