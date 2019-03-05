// @flow
import get from 'lodash/get';
import {TableSortOrder} from '$components/enums';

import {LeaseholdTransferPartyTypes} from '$src/leaseholdTransfer/enums';

import type {LeaseholdTransferList} from '$src/leaseholdTransfer/types';

/**
* Map leasehold transfer search filters for API
* @param {Object} query
* @returns {Object}
*/
export const mapLeaseholdTransferSearchFilters = (query: Object) => {
  const searchQuery = {...query};

  if(searchQuery.sort_key) {
    if(searchQuery.sort_key === 'properties') {
      searchQuery.ordering = ['institution_identifier'];
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

/**
* Map leashold transfer list count from API response
* @param {Object} query
* @returns {number}
*/
export const getLeaseholdTransferListCount = (list: LeaseholdTransferList) => get(list, 'count', 0);

/**
* Map leashold transfers from API response
* @param {Object} query
* @returns {number}
*/
export const getLeaseholdTransfers = (list: LeaseholdTransferList) =>
  get(list, 'results', [])
    .map((item) => {
      return {
        properties: item.properties,
        decision_date: item.decision_date,
        acquirers: get(item, 'parties', []).filter((party) => party.type === LeaseholdTransferPartyTypes.ACQUIRER),
        conveyors: get(item, 'parties', []).filter((party) => party.type === LeaseholdTransferPartyTypes.CONVEYOR),
      };
    });

/**
* Map leashold transfer max page  from API response
* @param {Object} query
* @returns {number}
*/
export const getLeaseholdTransferListMaxPage = (list: LeaseholdTransferList, size: number) => {
  const count = getLeaseholdTransferListCount(list);

  return Math.ceil(count/size);
};
