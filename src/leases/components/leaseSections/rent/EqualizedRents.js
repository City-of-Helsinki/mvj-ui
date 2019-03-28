// @flow
import React from 'react';
import {connect} from 'react-redux';

import AmountWithVat from '$components/vat/AmountWithVat';
import SortableTable from '$components/table/SortableTable';
import {LeaseEqualizedRentsFieldPaths, LeaseEqualizedRentsFieldTitles} from '$src/leases/enums';
import {TableSortOrder} from '$components/enums';
import {
  formatDate,
  formatNumber,
  isFieldAllowedToRead,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  equalizedRents: Array<Object>,
  leaseAttributes: Attributes,
}

const EqualizedRents = ({equalizedRents, leaseAttributes}: Props) => {
  const getColumns = () => {
    const columns = [];

    if(isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.PAYABLE_AMOUNT)) {
      columns.push({
        key: 'payable_amount',
        text: LeaseEqualizedRentsFieldTitles.PAYABLE_AMOUNT,
        renderer: (val, row) => {
          const func = val
            ? <AmountWithVat amount={val} date={row.end_date} />
            : '-';
          return func;
        },
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.EQUALIZATION_FACTOR)) {
      columns.push({
        key: 'equalization_factor',
        text: LeaseEqualizedRentsFieldTitles.EQUALIZATION_FACTOR,
        renderer: (val) => formatNumber(val) || '-',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.EQUALIZED_PAYABLE_AMOUNT)) {
      columns.push({
        key: 'equalized_payable_amount',
        text: LeaseEqualizedRentsFieldTitles.EQUALIZED_PAYABLE_AMOUNT,
        renderer: (val, row) => {
          const func = val
            ? <AmountWithVat amount={val} date={row.end_date} />
            : '-';
          return func;
        },
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.START_DATE)) {
      columns.push({
        key: 'start_date',
        text: LeaseEqualizedRentsFieldTitles.START_DATE,
        renderer: (val) => formatDate(val),
        defaultSorting: 'desc',
      });
    }

    if(isFieldAllowedToRead(leaseAttributes, LeaseEqualizedRentsFieldPaths.END_DATE)) {
      columns.push({
        key: 'end_date',
        text: LeaseEqualizedRentsFieldTitles.END_DATE,
        renderer: (val) => formatDate(val),
      });
    }

    return columns;
  };

  return (
    <SortableTable
      columns={getColumns()}
      data={equalizedRents}
      defaultSortKey='start_date'
      defaultSortOrder={TableSortOrder.DESCENDING}
      fixedHeader={true}
      noDataText='Ei tasattuja laskuja'
      sortable={true}
    />
  );
};

export default connect(
  (state) => {
    return {
      leaseAttributes: getAttributes(state),
    };
  }
)(EqualizedRents);
