// @flow
import React from 'react';
import {connect} from 'react-redux';

import AmountWithVat from '$components/vat/AmountWithVat';
import SortableTable from '$components/table/SortableTable';
import {LeaseIndexAdjustedRentsFieldTitles} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  sortByOptionsAsc,
  sortByOptionsDesc,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  indexAdjustedRents: Array<Object>,
}

const IndexAdjustedRents = ({attributes, indexAdjustedRents}: Props) => {
  const intendedUseOptions = getFieldOptions(attributes,
    'rents.child.children.index_adjusted_rents.child.children.intended_use');

  return (
    <SortableTable
      columns={[
        {
          key: 'amount',
          text: LeaseIndexAdjustedRentsFieldTitles.AMOUNT,
          renderer: (val, row) => {
            const func = val
              ? <AmountWithVat amount={val} date={row.end_date} />
              : '-';
            return func;
          },
          ascSortFunction: sortNumberByKeyAsc,
          descSortFunction: sortNumberByKeyDesc,
        },
        {
          key: 'intended_use',
          text: LeaseIndexAdjustedRentsFieldTitles.INTENDED_USE,
          renderer: (val) => getLabelOfOption(intendedUseOptions, val),
          ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions),
          descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions),
        },
        {
          key: 'start_date',
          text: LeaseIndexAdjustedRentsFieldTitles.START_DATE,
          renderer: (val) => formatDate(val),
          defaultSorting: 'desc',
        },
        {
          key: 'end_date',
          text: LeaseIndexAdjustedRentsFieldTitles.END_DATE,
          renderer: (val) => formatDate(val),
        },
        {
          key: 'factor',
          text: LeaseIndexAdjustedRentsFieldTitles.FACTOR, 
          renderer: (val) => formatNumber(val),
          ascSortFunction: sortNumberByKeyAsc,
          descSortFunction: sortNumberByKeyDesc,
        },
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
