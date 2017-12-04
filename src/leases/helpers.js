// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import moment from 'moment';

export const formatDate = (date: string) => {
  if (!date) {
    return '';
  }

  const d = isNumber(date) ? moment.unix(date) : moment(date);
  return d.format('DD.MM.YYYY');
};

export const formatDateRange = (startDate: any, endDate: any) => {
  if (!startDate && !endDate) {
    return '';
  }

  const start = isNumber(startDate) ? moment.unix(startDate) : moment(startDate),
    end = isNumber(endDate) ? moment.unix(endDate) : moment(endDate);

  const dateFormat = 'DD.MM.YYYY';
  if(!startDate) {
    return `- ${end.format(dateFormat)}`;
  }
  if(!endDate) {
    return `${start.format(dateFormat)} -`;
  }

  return `${start.format(dateFormat)} - ${end.format(dateFormat)}`;

};

export const formatSequenceNumber = (value: number) => {
  if(!value) {
    return '';
  }
  const length = value.toString().length;
  if (length < 4) {
    let prefix = '';
    for (var i = 1; i <= 4 - length; i++) {
      prefix += '0';
    }
    return prefix + value.toString();
  }
  return  value.toString();
};

export const getContentLeaseIdentifier = (item:Object) => {
  if(isEmpty(item)) {
    return null;
  }
  const unit = `${get(item, 'type')}${get(item, 'municipality')}${get(item, 'district')}-${formatSequenceNumber(get(item, 'sequence'))}`;
  return unit;
};

export const getContentLeaseDateRange = (item: Object) => {
  return formatDateRange(get(item, 'start_date'), get(item, 'end_date'));
};

export const getFullAddress = (item: Object) => {
  if(!get(item, 'zip_code') && !get(item, 'town')) {
    return get(item, 'address');
  }
  return `${get(item, 'address')}, ${get(item, 'zip_code')} ${get(item, 'town')}`;
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

export const getDistrictOptions = (attributes: Object) => {
  const choices = get(attributes, 'district.choices', []);
  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};

export const getMunicipalityOptions = (attributes: Object) => {
  const choices = get(attributes, 'municipality.choices', []);
  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};

export const getTypeOptions = (attributes: Object) => {
  const choices = get(attributes, 'type.choices', []);
  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'value')} ${get(choice, 'display_name')}`,
    };
  }).sort(function(a, b){
    const keyA = a.value,
      keyB = b.value;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};
