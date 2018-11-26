// @flow
import React from 'react';
import {connect} from 'react-redux';

import SortableTable from '$components/table/SortableTable';
import {RentTypes} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  sortByOptionsAsc,
  sortByOptionsDesc,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractRents: Array<Object>,
  rentType: string
}

const ContractRents = ({attributes, contractRents, rentType}: Props) => {
  const amountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.period');
  const baseAmountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.base_amount_period');
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.intended_use');

  const getAmount = (rent: Object) => {
    if(!rent.amount) {
      return null;
    }

    return `${formatNumber(rent.amount)} € ${getLabelOfOption(amountPeriodOptions, rent.period)}`;
  };

  const getBaseAmount = (rent: Object) => {
    if(!rent.base_amount) {
      return null;
    }

    return `${formatNumber(rent.base_amount)} € ${getLabelOfOption(baseAmountPeriodOptions, rent.base_amount_period)}`;
  };

  const getColumns = () => {
    if(rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) {
      return [
        {key: 'amount', text: 'Perusvuosivuokra', renderer: (val, item) => getAmount(item), ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'intended_use', text: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val), ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions), descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)},
        {key: 'base_amount', text: 'Vuokranlaskennan perusteena oleva vuokra', renderer: (val, item) => getBaseAmount(item), ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'base_year_rent ', text: 'Uusi perusvuosivuokra', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val), defaultSorting: 'desc'},
        {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
      ];
    } else {
      return [
        {key: 'amount', text: 'Perusvuosivuokra', renderer: (val, item) => getAmount(item), ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'intended_use', text: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val), ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions), descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)},
        {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val), defaultSorting: 'desc'},
        {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
      ];
    }
  };

  const columns = getColumns();

  return (
    <SortableTable
      columns={columns}
      data={contractRents}
      fixedHeader={true}
      noDataText='Ei sopimusvuokria'
      sortable={true}
    />
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(ContractRents);
