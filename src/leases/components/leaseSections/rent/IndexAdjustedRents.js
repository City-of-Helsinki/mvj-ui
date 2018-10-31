// @flow
import React from 'react';
import {connect} from 'react-redux';

import AmountWithVat from '$components/vat/AmountWithVat';
import SortableTable from '$components/table/SortableTable';
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
  indexAdjustedRents: Array<Object>,
}

const IndexAdjustedRents = ({attributes, indexAdjustedRents}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.index_adjusted_rents.child.children.intended_use');

  return (
    <SortableTable
      columns={[
        {
          key: 'amount',
          text: 'Indeksitarkastettu vuokra',
          renderer: (val, row) => {
            const func = val
              ? <AmountWithVat amount={val} date={row.end_date} />
              : '-';
            return func;
          },
          ascSortFunction: sortNumberByKeyAsc,
          descSortFunction: sortNumberByKeyDesc,
        },
        {key: 'intended_use', text: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val), ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions), descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)},
        {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val), defaultSorting: 'desc'},
        {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
        {key: 'factor', text: 'Laskentakerroin', renderer: (val) => formatNumber(val), ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ]}
      data={indexAdjustedRents}
      fixedHeader={true}
      noDataText='Ei indeksitarkistettuja vuokria'
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
)(IndexAdjustedRents);
