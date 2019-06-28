// @flow
import moment from 'moment';

import {TableSortOrder} from '$src/enums';
import {getContentInvoiceReceivableTypes} from '$src/invoices/helpers';
import {getApiResponseResults} from '$util/helpers';

import type {SapInvoiceList} from '$src/sapInvoice/types';

/**
 * Get sap invoices from API response
 * @param {Object} list
 * @returns {number}
 */
export const getSapInvoices = (list: SapInvoiceList) =>
  getApiResponseResults(list)
    .map((item) => {
      return {
        id: item.id,
        send_to_sap_date: item.due_date ? moment(item.due_date).subtract(1, 'months').format('YYYY-MM-DD') : null,
        recipient: item.recipient,
        due_date: item.due_date,
        billed_amount: item.billed_amount,
        lease: item.lease,
        receivableTypes: getContentInvoiceReceivableTypes(item.rows || []),
      };
    });

/**
 * Map sap invoice search filters for API
 * @param {Object} query
 * @returns {Object}
 */
export const mapSapInvoiceSearchFilters = (query: Object): Object => {
  const searchQuery = {...query};

  if(searchQuery.sort_key) {
    if(searchQuery.sort_key === 'send_to_sap_date') {
      searchQuery.ordering = ['due_date'];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};
