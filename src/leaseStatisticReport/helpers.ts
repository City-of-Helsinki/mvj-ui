import get from "lodash/get";
import format from "date-fns/format";
import { formatDate, formatNumber } from "src/util/helpers";
import { LeaseStatisticReportFormatOptions } from "src/leaseStatisticReport/enums";
import type { Reports } from "src/types";
import { FieldTypes } from "src/enums";

/**
 * Get report type options
 * @param {Reports} reports
 * @return {Report[]}
 */
export const getReportTypeOptions = (reports: Reports): Array<Record<string, any>> => {
  if (reports) return Object.entries(reports).map(([key, value]) => {
    return {
      value: key,
      label: value.name
    };
  });else return [];
};

/**
 * Get report url
 * @param {Reports} reports
 * @param {string} reportType
 * @return {Report[]}
 */
export const getReportUrl = (reports: Reports, reportType: string): string => {
  let url = '';
  if (reports) Object.entries(reports).map(([key, value]) => {
    if (key === reportType) url = value.url;
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
export const getPayload = (query: string, url: string, reportType: string): Record<string, any> => {
  return {
    url: url,
    report_type: reportType,
    query: query
  };
};

/**
 * Get display name from choices
 * @param {Object[]} choices
 * @param {string} value
 * @return {string}
 */
export const getDisplayName = (choices: Array<Record<string, any>>, value: string): string => {
  let displayName = value;
  const matchingName = choices.find(choice => choice.value === value)?.display_name;

  if (matchingName) {
    displayName = matchingName;
  }

  return displayName;
};

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
export const getFields = (options: Record<string, any>): Array<any> => {
  return get(options, 'actions.GET');
};

/*
* Get Query parameters
* @param {object} formValues
*/
export const getQueryParams = (formValues: Record<string, any>): any => {
  let query = '';
  if (formValues) Object.entries(formValues).map(([key, value]) => {
    if (key.includes('date')) {
      query += `${key}=${format(value, 'yyyy-MM-dd')}&`;
    } else query += `${key}=${value}&`;
  });
  return query.slice(0, -1);
};

/**
 * Get outputfields
 * @param {Object} options
 * @return {Array[]}
 */
export const getOutputFields = (options: Record<string, any>): Array<Record<string, any>> => {
  if (options) return Object.entries(options.output_fields).map(([key, value]) => {
    return {
      key: key,
      // @ts-ignore: Property 'choices' does not exist on type 'unknown'.
      label: value.label,
      // @ts-ignore: Property 'choices' does not exist on type 'unknown'.
      choices: value.choices,
      // @ts-ignore: Property 'choices' does not exist on type 'unknown'.
      format: value.format,
      // @ts-ignore: Property 'choices' does not exist on type 'unknown'.
      isNumeric: value.is_numeric
    };
  });else return [];
};

/**
 * Format type
 * @param {Object} value
 * @return {string}
 */
export const formatType = (value: Record<string, any>): string => {
  const formattedValue = get(value, 'type').replace('Model', '').replace('Field', '').replace('Null', '').toLowerCase();

  switch (formattedValue) {
    case "multiplechoice":
      return FieldTypes.MULTISELECT;

    default:
      return formattedValue;
  }
};

/**
 * Parses the query params from service_unit=num1,num2 format
 * into service_unit=num1&service_unit=num2 format
 * @param {string} query
 * @return {string}
 */
export const parseServiceUnitQuery = (query: string): string => {
  const queryArray = query.split('&');
  const serviceUnitIndex = queryArray.findIndex((item: string) => item.includes("service_unit"));

  if (serviceUnitIndex !== -1) {
    const serviceUnitQuery = queryArray.splice(serviceUnitIndex, 1);
    const serviceUnitIds = serviceUnitQuery[0].split('=')[1].split(',');
    serviceUnitIds.forEach(id => {
      if (id) queryArray.push(`service_unit=${id}`);
    });
    return queryArray.join('&');
  } else {
    return query;
  }
};