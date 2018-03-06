// @flow
import React from 'react';

import {formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getLabelOfOption} from '$util/helpers';
import {priceTypeOptions, purposeOptions} from '$src/constants';

type Props = {
  contractRents: Array<Object>,
  rentType: string
}

const ContractRents = ({contractRents, rentType}: Props) => {
  return (
    <table className="contract-rent-table">
      <thead>
        <tr>
          <th>Sopimusvuokra</th>
          <th>Käyttötarkoitus</th>
          {(rentType === '0' || rentType === '4') &&
            <th>Vuokranlaskennan perusteena oleva vuokra</th>
          }
          {(rentType === '0' || rentType === '4') &&
            <th>Uusi perusvuosi vuokra</th>
          }
          <th>Voimassaoloaika</th>
        </tr>
      </thead>
      <tbody>
        {contractRents && contractRents.length > 0 && contractRents.map((rent, index) => {
          return (
            <tr key={index}>
              <td>{rent.contract_rent ? `${formatNumberWithThousandSeparator(formatDecimalNumber(rent.contract_rent), '.')} ${rent.type ? getLabelOfOption(priceTypeOptions, rent.type) : ''}` : '-'}</td>
              <td>{rent.purpose ? getLabelOfOption(purposeOptions, rent.purpose) : '-'}</td>
              {(rentType === '0' || rentType === '4') &&
                <td>{rent.basic_rent ? `${formatNumberWithThousandSeparator(formatDecimalNumber(rent.basic_rent), '.')} ${rent.basic_rent_type ? getLabelOfOption(priceTypeOptions, rent.basic_rent_type) : ''}` : '-'}</td>
              }
              {(rentType === '0' || rentType === '4') &&
                <td>{rent.basic_rent_new ? `${formatNumberWithThousandSeparator(formatDecimalNumber(rent.basic_rent_new), '.')} ${rent.basic_rent_type ? getLabelOfOption(priceTypeOptions, rent.basic_rent_type) : ''}` : '-'}</td>
              }
              <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ContractRents;
