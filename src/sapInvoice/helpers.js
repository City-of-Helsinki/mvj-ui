// @flow
import get from 'lodash/get';
import moment from 'moment';

import {TableSortOrder} from '$components/enums';
import {getContentInvoiceReceivableTypes} from '$src/invoices/helpers';

import type {SapInvoiceList} from '$src/sapInvoice/types';

/*
* Map sap invoice list count from API response
* @param {Object} list
* @returns {number}
*/
export const getSapInvoiceListCount = (list: SapInvoiceList) => get(list, 'count', 0);

/*
* Map sap invoices from API response
* @param {Object} list
* @returns {number}
*/
export const getSapInvoices = (list: SapInvoiceList) =>
  get(list, 'results', [])
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

/*
* Map sap invoice max page from API response
* @param {Object} list
* @param {number} size
* @returns {number}
*/
export const getSapInvoiceListMaxPage = (list: SapInvoiceList, size: number) => {
  const count = getSapInvoiceListCount(list);

  return Math.ceil(count/size);
};

/**
* Map sap invoice search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapSapInvoiceSearchFilters = (query: Object) => {
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
