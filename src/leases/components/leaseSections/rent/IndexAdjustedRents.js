// @flow
import React from 'react';

import {formatDateRange, formatNumberWithThousandSeparator, formatDecimalNumbers} from '../../../../util/helpers';
import TableFixedHeader from '../../../../components/TableFixedHeader';
import {getRentIndexAdjustedRentPurposeLabel} from '../helpers';

type Props = {
  indexAdjustedRents: Array<Object>,
}

const getTableBody = (indexAdjustedRents: Array<Object>) => {
  if(indexAdjustedRents && indexAdjustedRents.length > 0) {
    return (
      <tbody>
        {indexAdjustedRents.map((rent, index) => (
          <tr key={index}>
            <td>{rent.rent !== null ? formatNumberWithThousandSeparator(formatDecimalNumbers(rent.rent), '.') : '-'}</td>
            <td style={{maxWidth: '150px'}}
              title={rent.purpose ? getRentIndexAdjustedRentPurposeLabel(rent.purpose) : '-'}>
              <div className="text-container">{rent.purpose ? getRentIndexAdjustedRentPurposeLabel(rent.purpose) : '-'}</div>
            </td>
            <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            <td>{rent.calculation_factor !== null ? formatDecimalNumbers(rent.calculation_factor) : '-'}</td>
          </tr>
        ))}
      </tbody>
    );
  }
  else {
    return (
      <tbody></tbody>
    );
  }
};

const IndexAdjustedRents = ({indexAdjustedRents}: Props) => {
  return (
    <TableFixedHeader
      headers={[
        'Ind. tark. vuokra (€)',
        'Käyttötarkoitus',
        'Voimassaoloaika',
        'Laskentakerroin',
      ]}
      body={getTableBody(indexAdjustedRents)}
    />
  );
};

export default IndexAdjustedRents;
