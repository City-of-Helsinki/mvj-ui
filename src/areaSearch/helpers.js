// @flow

import isArray from 'lodash/isArray';
import {TableSortOrder} from '$src/enums';

export const areaSearchSearchFilters = (query: Object): Object => {
  const searchQuery = {...query};

  searchQuery.state = isArray(searchQuery.state)
    ? searchQuery.state
    : searchQuery.state ? [searchQuery.state] : [];

  if (searchQuery.sort_key) {
    searchQuery.ordering = [searchQuery.sort_key];

    if(searchQuery.sort_order === TableSortOrder.DESCENDING) {
      searchQuery.ordering = searchQuery.ordering.map((key) => `-${key}`);
    }

    delete searchQuery.sort_key;
    delete searchQuery.sort_order;
  }

  return searchQuery;
};
