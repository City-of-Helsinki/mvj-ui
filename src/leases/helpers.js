// @flow
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import moment from 'moment';

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }
  const d = isNumber(date) ? moment.unix(date) : moment(date);

  return d.format('D.M.YYYY');
};

export const getContentRealPropertyUnit = (item:Object) => {
  const unit = get(item, 'real_property_units[0].identification_number');
  return unit;
};

export const getContentLeaseTenant = (item:Object) => {
  const tenant = get(item, 'tenants[0].contact.name');
  return tenant;
};

export const getContentLeaseItem = (item:Object) => {
  return {
    id: get(item, 'id'),
    identifier: get(item, 'identifier'),
    real_property_unit: getContentRealPropertyUnit(item),
    tenant: getContentLeaseTenant(item),
    lease_type: get(item, 'application.type'),
    start_date: formatDate(get(item, 'start_date')),
    end_date: formatDate(get(item, 'end_date')),
  };
};

export const getContentLeases = (content:Array<Object>) => {
  const items = [];
  if(!content) {
    return [];
  }

  for(let i = 0; i < content.length; i++) {
    const item = getContentLeaseItem(content[i]);
    items.push(item);
  }
  return items;
};
