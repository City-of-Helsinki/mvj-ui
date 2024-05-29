import format from "date-fns/format";
import subMonths from "date-fns/subMonths";
import { TableSortOrder } from "enums";
import { getContentInvoiceReceivableTypes } from "invoices/helpers";
import { getApiResponseResults } from "util/helpers";
import type { SapInvoiceList } from "sapInvoice/types";

/**
 * Get sap invoices from API response
 * @param {Object} list
 * @returns {number}
 */
export const getSapInvoices = (list: SapInvoiceList) => getApiResponseResults(list).map(item => {
  return {
    id: item.id,
    send_to_sap_date: item.due_date ? format(subMonths(new Date(item.due_date), 1), 'yyyy-MM-dd') : null,
    recipient: item.recipient,
    due_date: item.due_date,
    billed_amount: item.billed_amount,
    lease: item.lease,
    receivableTypes: getContentInvoiceReceivableTypes(item.rows || [])
  };
});

/**
 * Map sap invoice search filters for API
 * @param {Object} query
 * @returns {Object}
 */
export const mapSapInvoiceSearchFilters = (query: Record<string, any>): Record<string, any> => {
  const searchQuery = { ...query
  };

  if (searchQuery.sort_key) {
    if (searchQuery.sort_key === 'send_to_sap_date') {
      searchQuery.ordering = ['due_date'];
    } else {
      searchQuery.ordering = [searchQuery.sort_key];
    }

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map(key => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};