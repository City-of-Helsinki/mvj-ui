import get from 'lodash/get';
import format from 'date-fns/format';

import {
  formatDate,
  formatNumber,
} from '$util/helpers';
import {
  LeaseStatisticReportFormatOptions,
} from '$src/leaseStatisticReport/enums';
import type {Reports} from '$src/types';

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
 * Get display name from choices
 * @param {Object[]} choices
 * @param {string} value
 * @return {string}
 */
export const getDisplayName = (choices: Array<Object>, value: string): string => {
  let displayName = value;
  const matchingName = choices.find((choice) => choice.value === value)?.display_name;
  if (matchingName) {
    displayName = matchingName;
  }
  return displayName;
}

/**
 * Get formatted value
 * @param {string} formatType
 * @param {string} value
 * @return {string}
 */
export const getFormattedValue = (formatType: string, value: string): string => {
  switch (formatType) {
    case LeaseStatisticReportFormatOptions.DATE:
      return formatDate(value, 'dd.MM.yyyy');
    case LeaseStatisticReportFormatOptions.MONEY:
    case LeaseStatisticReportFormatOptions.BOLD_MONEY:
      return `${formatNumber(value)} €`;
    case LeaseStatisticReportFormatOptions.PERCENTAGE:
      return `${formatNumber(value)} %`;
    case LeaseStatisticReportFormatOptions.AREA:
      return `${formatNumber(value)} m²`;
    default:
      return value;
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
      if(key.includes('date')){
        query += `${key}=${format(value, 'yyyy-MM-dd')}&`;
      }
      else
        query += `${key}=${value}&`;
    });
  return query.slice(0, -1);
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
        choices: value.choices,
        format: value.format,
        isNumeric: value.is_numeric,
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
