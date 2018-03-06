// @flow
import React from 'react';

import {formatDateRange, formatNumberWithThousandSeparator, formatDecimalNumber} from '$util/helpers';
import TableFixedHeader from '../../../../components/table/TableFixedHeader';

type Props = {
  chargedRents: Array<Object>,
}

const getTableBody = (chargedRents: Array<Object>) => {
  if(chargedRents && chargedRents.length > 0) {
    return (
      <tbody>
        {chargedRents.map((rent, index) => (
          <tr key={index}>
            <td>{rent.rent !== null ? formatNumberWithThousandSeparator(formatDecimalNumber(rent.rent), '.') : '-'}</td>
            <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            <td>{rent.difference !== null ? formatDecimalNumber(rent.difference) : '-'}</td>
            <td>{rent.calendar_year_rent !==null ? formatNumberWithThousandSeparator(formatDecimalNumber(rent.calendar_year_rent), '.') : '-'}</td>
          </tr>
        ))}
      </tbody>
    );
  }
  else {
    return <tbody></tbody>;
  }
};

const ChargedRents = ({chargedRents}: Props) => {
  return (
    <TableFixedHeader
      headers={[
        'Perittävä vuokra (€)',
        'Voimassaoloaika',
        'Nousu %',
        'Kalenterivuosivuokra',
      ]}
      body={getTableBody(chargedRents)}
    />
  );
};

export default ChargedRents;
