import type {Reports} from '$src/types';
import format from 'date-fns/format';

import {LeaseInvoicingReportTypes} from '$src/leaseStatisticReport/enums';

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
export const getPayload = (startDate: string, endDate: string, url: string, reportType: string, leaseType: string, invoiceState: string): Object => {
  let query = `start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}`;
  if(leaseType)
    query += `&lease_type=${leaseType}`;
  if (invoiceState)
    query += `&invoice_state=${invoiceState}`;
  if(reportType === LeaseInvoicingReportTypes.LEASE_COUNT || reportType === LeaseInvoicingReportTypes.LEASE_INVOICING_DISABLED)
    return {
      url: url,
      report_type: reportType,
      query: '',
    };
  else
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
