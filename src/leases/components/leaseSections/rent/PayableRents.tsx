import React from "react";
import { connect } from "react-redux";
import AmountWithVat from "@/components/vat/AmountWithVat";
import SortableTable from "@/components/table/SortableTable";
import { LeasePayableRentsFieldPaths, LeasePayableRentsFieldTitles } from "@/leases/enums";
import { TableSortOrder } from "@/enums";
import { formatDate, formatNumber, isFieldAllowedToRead, sortNumberByKeyAsc, sortNumberByKeyDesc } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  leaseAttributes: Attributes;
  payableRents: Array<Record<string, any>>;
};

const PayableRents = ({
  leaseAttributes,
  payableRents
}: Props) => {
  const getColumns = () => {
    const columns = [];

    if (isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.AMOUNT)) {
      columns.push({
        key: 'amount',
        text: LeasePayableRentsFieldTitles.AMOUNT,
        renderer: (val, row) => {
          const func = val ? <AmountWithVat amount={val} date={row.end_date} /> : '-';
          return func;
        },
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.START_DATE)) {
      columns.push({
        key: 'start_date',
        text: LeasePayableRentsFieldTitles.START_DATE,
        renderer: val => formatDate(val),
        defaultSorting: 'desc'
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.END_DATE)) {
      columns.push({
        key: 'end_date',
        text: LeasePayableRentsFieldTitles.END_DATE,
        renderer: val => formatDate(val)
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.DIFFERENCE_PERCENT)) {
      columns.push({
        key: 'difference_percent',
        text: LeasePayableRentsFieldTitles.DIFFERENCE_PERCENT,
        renderer: val => val ? `${formatNumber(val)} %` : '-'
      });
    }

    if (isFieldAllowedToRead(leaseAttributes, LeasePayableRentsFieldPaths.CALENDAR_YEAR_RENT)) {
      columns.push({
        key: 'calendar_year_rent',
        text: LeasePayableRentsFieldTitles.CALENDAR_YEAR_RENT,
        renderer: (val, row) => {
          const func = val ? <AmountWithVat amount={val} date={row.end_date} /> : '-';
          return func;
        }
      });
    }

    return columns;
  };

  return <SortableTable columns={getColumns()} data={payableRents} defaultSortKey='start_date' defaultSortOrder={TableSortOrder.DESCENDING} fixedHeader={true} noDataText='Ei perittäviä vuokria' sortable={true} />;
};

export default connect(state => {
  return {
    leaseAttributes: getAttributes(state)
  };
})(PayableRents);