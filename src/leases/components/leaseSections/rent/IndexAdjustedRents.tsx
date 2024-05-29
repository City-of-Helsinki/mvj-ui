import React from "react";
import { connect } from "react-redux";
import AmountWithVat from "components/vat/AmountWithVat";
import SortableTable from "components/table/SortableTable";
import { LeaseIndexAdjustedRentsFieldPaths, LeaseIndexAdjustedRentsFieldTitles } from "leases/enums";
import { TableSortOrder } from "enums";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, isFieldAllowedToRead, sortByOptionsAsc, sortByOptionsDesc, sortNumberByKeyAsc, sortNumberByKeyDesc } from "util/helpers";
import { getAttributes } from "leases/selectors";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  indexAdjustedRents: Array<Record<string, any>>;
};

const IndexAdjustedRents = ({
  attributes,
  indexAdjustedRents
}: Props) => {
  const getColumns = () => {
    const columns = [];
    const intendedUseOptions = getFieldOptions(attributes, LeaseIndexAdjustedRentsFieldPaths.INTENDED_USE);

    if (isFieldAllowedToRead(attributes, LeaseIndexAdjustedRentsFieldPaths.AMOUNT)) {
      columns.push({
        key: 'amount',
        text: LeaseIndexAdjustedRentsFieldTitles.AMOUNT,
        renderer: (val, row) => {
          const func = val ? <AmountWithVat amount={val} date={row.end_date} /> : '-';
          return func;
        },
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc
      });
    }

    if (isFieldAllowedToRead(attributes, LeaseIndexAdjustedRentsFieldPaths.INTENDED_USE)) {
      columns.push({
        key: 'intended_use',
        text: LeaseIndexAdjustedRentsFieldTitles.INTENDED_USE,
        renderer: val => getLabelOfOption(intendedUseOptions, val),
        ascSortFunction: (a, b, key) => sortByOptionsAsc(a, b, key, intendedUseOptions),
        descSortFunction: (a, b, key) => sortByOptionsDesc(a, b, key, intendedUseOptions)
      });
    }

    if (isFieldAllowedToRead(attributes, LeaseIndexAdjustedRentsFieldPaths.START_DATE)) {
      columns.push({
        key: 'start_date',
        text: LeaseIndexAdjustedRentsFieldTitles.START_DATE,
        renderer: val => formatDate(val),
        defaultSorting: 'desc'
      });
    }

    if (isFieldAllowedToRead(attributes, LeaseIndexAdjustedRentsFieldPaths.END_DATE)) {
      columns.push({
        key: 'end_date',
        text: LeaseIndexAdjustedRentsFieldTitles.END_DATE,
        renderer: val => formatDate(val)
      });
    }

    if (isFieldAllowedToRead(attributes, LeaseIndexAdjustedRentsFieldPaths.FACTOR)) {
      columns.push({
        key: 'factor',
        text: LeaseIndexAdjustedRentsFieldTitles.FACTOR,
        renderer: val => formatNumber(val),
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc
      });
    }

    return columns;
  };

  return <SortableTable columns={getColumns()} data={indexAdjustedRents} defaultSortKey='start_date' defaultSortOrder={TableSortOrder.DESCENDING} fixedHeader={true} noDataText='Ei indeksitarkistettuja vuokria' sortable={true} />;
};

export default connect(state => {
  return {
    attributes: getAttributes(state)
  };
})(IndexAdjustedRents);