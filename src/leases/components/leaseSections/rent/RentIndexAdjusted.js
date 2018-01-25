// @flow
import React from 'react';

import {formatDateRange, formatNumberWithThousandSeparator, formatDecimalNumbers} from '../../../../util/helpers';
import TableFixedHeader from '../../../../components/TableFixedHeader';

type Props = {
  indexAdjustedRents: Array<Object>,
}

const getTableBody = (indexAdjustedRents: Array<Object>) => {
  if(indexAdjustedRents && indexAdjustedRents.length > 0) {
    return indexAdjustedRents.map((rent, index) => {
      return (
        <tr key={index}>
          <td>{rent.rent !== null ? formatNumberWithThousandSeparator(formatDecimalNumbers(rent.rent), '.') : '-'}</td>
          <td>{rent.purpose ? rent.purpose : '-'}</td>
          <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
          <td>{rent.calculation_factor !== null ? formatDecimalNumbers(rent.calculation_factor) : '-'}</td>
        </tr>
      );
    });
  }
  else {
    return null;
  }
};

const RentIndexAdjusted = ({indexAdjustedRents}: Props) => {
  return (
    <TableFixedHeader
      headers={[
        'Ind. tark. vuokar (€)',
        'Käyttötarkoitus',
        'Voimassaoloaika',
        'Laskentakerroin',
      ]}
      body={getTableBody(indexAdjustedRents)}
    />
  );
};

export default RentIndexAdjusted;
