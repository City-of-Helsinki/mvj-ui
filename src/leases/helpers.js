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

export const getFullAddress = (item: Object) => {
  if(!get(item, 'zip_code') && !get(item, 'town')) {
    return get(item, 'address');
  }

  return `${get(item, 'address')}, ${get(item, 'zip_code')} ${get(item, 'town')}`;
};

export const formatSequenceNumber = (value: number) => {
  var length = value.toString().length;
  if (length < 4) {
    var prefix = '';
    for (var i = 1; i <= 4 - length; i++) {
      prefix += '0';
    }
    return prefix + value.toString();
  }
  return  value.toString();
};

export const getContentLeaseIdentifier = (item:Object) => {
  const unit = `${get(item, 'type')}${get(item, 'municipality')}${get(item, 'district')}-${formatSequenceNumber(get(item, 'sequence'))}`;
  return unit;
};

export const getContentRealPropertyUnit = (item:Object) => {
  const unit = `${get(item, 'lease_areas[0].municipality')}-${get(item, 'lease_areas[0].district')}-${get(item, 'lease_areas[0].sequence')}`;
  return unit;
};

export const getContentLeaseTenant = (item:Object) => {
  const tenant = get(item, 'tenants[0].contact.name');
  return tenant;
};

export const getContentLeaseItem = (item:Object) => {
  return {
    id: get(item, 'id'),
    identifier: getContentLeaseIdentifier(item),
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
