// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import {formatDate, formatDateRange} from '../util/helpers';

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

export const getContentRealPropertyUnit = (item: Object) => {
  const {assets} = item;
  if(isEmpty(assets)) {
    return null;
  }
  let realPropertyUnit = '';
  for(let i = 0; i < assets.length; i++) {
    //TODO: get real property unit when it's available at the end point
    console.log(assets[i]);
  }

  return realPropertyUnit;
};

export const getContentLeaseAddress = (item:Object) => {
  const {assets} = item;
  if(isEmpty(assets)) {
    return null;
  }
  let address = '';
  for(let i = 0; i < assets.length; i++) {
    if(get(assets[i], 'address')) {
      address = get(assets[i], 'address');
      return address;
    }
  }

  return address;
};

export const getContentLeaseStatus = (item: Object, options: Array<Object>) => {
  const {status} = item;
  if(!status) {
    return null;
  }

  for(let i = 0; i < options.length; i++) {
    if(options[i].value === status) {
      return get(options[i], 'label');
    }
  }
  return status;
};

export const getContentSummary = (lease: Object) => {
  return {
    financing_method: get(lease, 'financing_method'),
    hitas: get(lease, 'hitas'),
    lease_statistical_use: get(lease, 'lease_statistical_use'),
    lease_use: get(lease, 'lease_use'),
    lease_use_description: get(lease, 'lease_use_description'),
    lessor: get(lease, 'lessor'),
    management_method: get(lease, 'management_method'),
    notice_period: get(lease, 'notice_period'),
    notice_period_description: get(lease, 'notice_period_description'),
    publicity: get(lease, 'publicity'),
    regulatory: get(lease, 'regulatory'),
    regulatory_method: get(lease, 'regulatory_method'),
    special_apartments: get(lease, 'special_apartments'),
    transfer_right: get(lease, 'transfer_right'),
  };
};
export const getContentFixedInitialYearRentItems = (items: Object) => {
  return items.map((item) => {
    return {
      end_date: item.end_date ? moment(item.end_date) : null,
      rent: get(item, 'rent'),
      start_date: item.start_date ? moment(item.start_date) : null,
    };
  });
};

export const getContentRentBasicInfo = (basicInfoData: Object) => {
  return {
    adjustment_start_date: basicInfoData.adjustment_start_date ? moment(basicInfoData.adjustment_start_date) : null,
    adjustment_end_date: basicInfoData.adjustment_end_date ? moment(basicInfoData.adjustment_end_date) : null,
    basic_index: get(basicInfoData, 'basic_index'),
    basic_index_rounding: get(basicInfoData, 'basic_index_rounding'),
    comment: get(basicInfoData, 'comment', ''),
    due_dates: get(basicInfoData, 'due_dates', []),
    fidex_initial_year_rents: getContentFixedInitialYearRentItems(get(basicInfoData, 'fidex_initial_year_rents', [])),
    index_type: get(basicInfoData, 'index_type'),
    rental_period: get(basicInfoData, 'rental_period'),
    type: get(basicInfoData, 'type'),
    y_value: get(basicInfoData, 'y_value'),
    y_value_start: get(basicInfoData, 'y_value_start'),
    x_value: get(basicInfoData, 'x_value'),
  };
};

export const getContentRentDiscount = (discountData: Object) => {
  return discountData.map((discount) => {
    return (
    {
      amount: get(discount, 'amount', ''),
      amount_left: get(discount, 'amount_left', ''),
      amount_type: get(discount, 'amount_type', ''),
      comment: get(discount, 'comment', ''),
      end_date: discount.end_date ? moment(discount.end_date) : null,
      purpose: get(discount, 'purpose', ''),
      rule: get(discount, 'rule', ''),
      start_date: discount.start_date ? moment(discount.start_date) : null,
      type: get(discount, 'type', ''),
    });
  });
};

export const getContentRentCriteria = (criteriaData: Object) => {
  return criteriaData.map((criteria) => {
    return (
    {
      agreed: get(criteria, 'agreed', false),
      purpose: get(criteria, 'purpose'),
      km2: get(criteria, 'km2'),
      index: get(criteria, 'index'),
      ekm2ind100: get(criteria, 'ekm2ind100'),
      ekm2ind: get(criteria, 'ekm2ind'),
      percentage: get(criteria, 'percentage'),
      basic_rent: get(criteria, 'basic_rent'),
      start_rent: get(criteria, 'start_rent'),
    });
  });
};

export const getContentRentChargedRents = (chargedRentsData: Object) => {
  return chargedRentsData.map((rent) => {
    return (
    {
      calendar_year_rent: get(rent, 'calendar_year_rent'),
      difference: get(rent, 'difference'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      rent: get(rent, 'rent'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
    });
  });
};

export const getContentRentContractRents = (contractRentsData: Object) => {
  return contractRentsData.map((rent) => {
    return (
    {
      basic_rent: get(rent, 'basic_rent'),
      basic_rent_type: get(rent, 'basic_rent_type'),
      contract_rent: get(rent, 'contract_rent'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      purpose: get(rent, 'purpose'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
      type: get(rent, 'type'),
    });
  });
};

export const getContentRentIndexAdjustedRents = (indexAdjustedRentsData: Object) => {
  return indexAdjustedRentsData.map((rent) => {
    return (
    {
      calculation_factor: get(rent, 'calculation_factor'),
      end_date: rent.end_date ? moment(rent.end_date) : null,
      purpose: get(rent, 'purpose'),
      rent: get(rent, 'rent'),
      start_date: rent.start_date ? moment(rent.start_date) : null,
    });
  });
};

export const getContentRents = (lease: Object) => {
  return {
    rent_info_ok: get(lease, 'rents.rent_info_ok', false),
    basic_info: getContentRentBasicInfo(get(lease, 'rents.basic_info', [])),
    charged_rents: getContentRentChargedRents(get(lease, 'rents.charged_rents', [])),
    contract_rents: getContentRentContractRents(get(lease, 'rents.contract_rents', [])),
    criterias: getContentRentCriteria(get(lease, 'rents.criterias', [])),
    discounts: getContentRentDiscount(get(lease, 'rents.discounts', [])),
    index_adjusted_rents: getContentRentIndexAdjustedRents(get(lease, 'rents.index_adjusted_rents', [])),
  };
};


export const getFullAddress = (item: Object) => {
  if(!get(item, 'zip_code') && !get(item, 'town')) {
    return get(item, 'address');
  }
  return `${get(item, 'address')}, ${get(item, 'zip_code')} ${get(item, 'town')}`;
};

export const getContentLeaseTenant = (item:Object) => {
  const tenant = get(item, 'tenants[0].contact.name');
  return tenant;
};

export const getContentLeaseItem = (item:Object, statusOptions: Array<Object>) => {
  return {
    id: get(item, 'id'),
    real_property_unit: getContentRealPropertyUnit(item),
    identifier: getContentLeaseIdentifier(item),
    address: getContentLeaseAddress(item),
    status: getContentLeaseStatus(item, statusOptions),
    status_code: get(item, 'status'),
    start_date: formatDate(item.start_date),
    end_date: formatDate(item.end_date),
  };
};

export const getContentLeases = (content:Object, attributes: Object) => {
  const items = [];
  const {results} = content;
  const statusOptions = getStatusOptions(attributes);

  if(!results) {
    return [];
  }

  for(let i = 0; i < results.length; i++) {
    const item = getContentLeaseItem(results[i], statusOptions);
    items.push(item);
  }
  return items;
};

export const getLeasesFilteredByDocumentType = (items: Array<Object>, documentTypes: Array<string>) => {
  if(!documentTypes || documentTypes.length === 0) {
    return items;
  }
  return items.filter((item) => {
    return documentTypes.indexOf(item.status_code) !== -1;
  });

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

export const getStatusOptions = (attributes: Object) => {
  const choices = get(attributes, 'status.choices', []);
  return choices.map((choice) => {
    return {
      value: get(choice, 'value'),
      label: `${get(choice, 'display_name')}`,
    };
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
