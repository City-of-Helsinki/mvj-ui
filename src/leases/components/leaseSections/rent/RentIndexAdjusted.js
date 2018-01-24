// @flow
import React from 'react';

import {formatDateRange, formatNumberWithThousandSeparator, formatDecimalNumbers} from '../../../../util/helpers';
type Props = {
  indexAdjustedRents: Array<Object>,
}

const RentIndexAdjusted = ({indexAdjustedRents}: Props) => {
  return (
    <div>
      <table>
          <thead>
            <tr>
              <th>Ind. tark. vuokar (€)</th>
              <th>Käyttötarkoitus</th>
              <th>Voimassaoloaika</th>
              <th>Laskentakerroin</th>
            </tr>
          </thead>
          <tbody>
            {indexAdjustedRents && indexAdjustedRents.length > 0 && indexAdjustedRents.map((rent) => {
              return (
                <tr>
                  <td>{rent.rent ? formatNumberWithThousandSeparator(formatDecimalNumbers(rent.rent), '.') : '-'}</td>
                  <td>{rent.purpose ? rent.purpose : '-'}</td>
                  <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
                  <td>{rent.calculation_factor ? formatDecimalNumbers(rent.calculation_factor) : '-'}</td>
                </tr>
              );
            })}
          </tbody>
      </table>
    </div>
  );
};

export default RentIndexAdjusted;
