import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

export const getSearchQuery = (filters) => {
  let query = [];

  forEach(filters, (filter, key) => {
    if (!isEmpty(filter) || isNumber(filter)) {
      if (isArray(filter)) {
        const items = [];
        forEach(filter, (item) => {
          items.push(encodeURIComponent(item));
        });
        filter = items;
      }

      if (key === 'page' && Number(filter) < 2) {
        return;
      }

      if (key === 'type') {
        query.push(`${key}=${encodeURIComponent(filter.toUpperCase())}`);
        return;
      }

      query.push(`${key}=${isArray(filter) ? filter.join(',') : encodeURIComponent(filter)}`);
    }
  });

  return query.length ? `?${query.join('&')}` : '';
};
