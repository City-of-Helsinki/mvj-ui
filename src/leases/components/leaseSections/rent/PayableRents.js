// @flow
import React from 'react';

import {
  formatDate,
  formatNumber,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import Table from '$components/table/Table';

type Props = {
  payableRents: Array<Object>,
}

const PayableRents = ({payableRents}: Props) => {
  return (
    <Table
      data={payableRents}
      dataKeys={[
        {key: 'amount', label: 'Indeksitarkastettu vuokra (€)', renderer: (val) => formatNumber(val), ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDate(val), defaultSorting: 'desc'},
        {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDate(val)},
        {key: 'difference_percent', label: 'Nousu %', renderer: (val) => formatNumber(val)},
        {key: 'calendar_year_rent', label: 'Kalenterivuosivuokra', renderer: (val) => formatNumber(val)},
      ]}
      fixedHeader
      sortable
      tableFixedLayout
    />
  );
};

export default PayableRents;
