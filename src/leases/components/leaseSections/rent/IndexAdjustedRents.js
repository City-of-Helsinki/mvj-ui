// @flow
import React from 'react';

import {formatDateRange,
  formatNumberWithThousandSeparator,
  formatDecimalNumber,
  getLabelOfOption} from '$util/helpers';
import {purposeOptions} from '$src/constants';
import TableFixedHeader from '$components/table/TableFixedHeader';

type Props = {
  indexAdjustedRents: Array<Object>,
}

const getTableBody = (indexAdjustedRents: Array<Object>) => {
  if(indexAdjustedRents && indexAdjustedRents.length > 0) {
    return (
      <tbody>
        {indexAdjustedRents.map((rent, index) => (
          <tr key={index}>
            <td>{rent.rent !== null ? formatNumberWithThousandSeparator(formatDecimalNumber(rent.rent), '.') : '-'}</td>
            <td style={{maxWidth: '150px'}}
              title={rent.purpose ? getLabelOfOption(purposeOptions, rent.purpose) : '-'}>
              <div className="text-container">{rent.purpose ? getLabelOfOption(purposeOptions, rent.purpose) : '-'}</div>
            </td>
            <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            <td>{rent.calculation_factor !== null ? formatDecimalNumber(rent.calculation_factor) : '-'}</td>
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
        'Indeksitarkastettu vuokra (€)',
        'Käyttötarkoitus',
        'Voimassaoloaika',
        'Laskentakerroin',
      ]}
      body={getTableBody(indexAdjustedRents)}
    />
  );
};

export default IndexAdjustedRents;
