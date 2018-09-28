// @flow
import React from 'react';

import SortableTable from '$components/table/SortableTable';
import {
  formatDate,
  formatNumber,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';

type Props = {
  payableRents: Array<Object>,
}

const PayableRents = ({payableRents}: Props) => {
  return (
    <SortableTable
      columns={[
        {key: 'amount', text: 'Indeksitarkastettu vuokra', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'start_date', text: 'Alkupvm', renderer: (val) => formatDate(val), defaultSorting: 'desc'},
        {key: 'end_date', text: 'Loppupvm', renderer: (val) => formatDate(val)},
        {key: 'difference_percent', text: 'Nousu', renderer: (val) => val ? `${formatNumber(val)} %` : '-'},
        {key: 'calendar_year_rent', text: 'Kalenterivuosivuokra', renderer: (val) => val ? `${formatNumber(val)} €` : '-'},
      ]}
      data={payableRents}
      fixedHeader={true}
      sortable={true}
    />
  );
};

export default PayableRents;
