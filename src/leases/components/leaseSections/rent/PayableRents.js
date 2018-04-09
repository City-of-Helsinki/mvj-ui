// @flow
import React from 'react';

import {
  formatDateRange,
  formatNumberWithThousandSeparator,
  formatDecimalNumber,
} from '$util/helpers';
import TableFixedHeader from '$components/table/TableFixedHeader';

type Props = {
  payableRents: Array<Object>,
}

const getTableBody = (rents: Array<Object>) => {
  if(rents && !!rents.length) {
    return (
      <tbody>
        {rents.map((rent, index) => (
          <tr key={index}>
            <td>{formatNumberWithThousandSeparator(formatDecimalNumber(rent.amount), '.') || '-'}</td>
            <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            <td>{formatDecimalNumber(rent.difference_percent) || '-'}</td>
            <td>{formatNumberWithThousandSeparator(formatDecimalNumber(rent.calendar_year_rent), '.') || '-'}</td>
          </tr>
        ))}
      </tbody>
    );
  }
  else {
    return <tbody><tr className='no-data'><td colSpan={4}>Ei perittäviä vuokria</td></tr></tbody>;
  }
};

const PayableRents = ({payableRents}: Props) => {
  return (
    <TableFixedHeader
      headers={[
        'Perittävä vuokra (€)',
        'Voimassaoloaika',
        'Nousu %',
        'Kalenterivuosivuokra',
      ]}
      body={getTableBody(payableRents)}
    />
  );
};

export default PayableRents;
