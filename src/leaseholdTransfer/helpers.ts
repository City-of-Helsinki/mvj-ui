import get from "lodash/get";
import { LeaseholdTransferPartyTypes } from "src/leaseholdTransfer/enums";
import { TableSortOrder } from "src/enums";
import { getApiResponseResults } from "src/util/helpers";
import type { LeaseholdTransferList } from "src/leaseholdTransfer/types";

/**
* Map leasehold transfer search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapLeaseholdTransferSearchFilters = (query: Record<string, any>): Record<string, any> => {
  const searchQuery = { ...query
  };

  if (searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if (searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map(key => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  if (searchQuery.with_deleted !== 'true') {
    delete searchQuery.with_deleted;
  }

  return searchQuery;
};

/**
 * Get leashold transfers from api response
 * @param {Object} query
 * @returns {Object[]}
 */
export const getContentLeaseholdTransfers = (list: LeaseholdTransferList): Array<Record<string, any>> => getApiResponseResults(list).map(item => {
  return {
    id: item.id,
    properties: item.properties,
    institution_identifier: item.institution_identifier,
    decision_date: item.decision_date,
    acquirers: get(item, 'parties', []).filter(party => party.type === LeaseholdTransferPartyTypes.ACQUIRER),
    conveyors: get(item, 'parties', []).filter(party => party.type === LeaseholdTransferPartyTypes.CONVEYOR),
    deleted: item.deleted
  };
});