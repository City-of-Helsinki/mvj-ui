// @flow
import React from 'react';

import {formatDateRange, formatDecimalNumbers, formatNumberWithThousandSeparator} from '../../../../util/helpers';
import {getRentContractRentPurposeLabel,
  getRentContractRentTypeLabel} from '../helpers';

type Props = {
  contractRents: Array<Object>,
}

const ContractRent = ({contractRents}: Props) => {
  return (
    <table className="contract-rent-table">
      <thead>
        <tr>
          <th>Sopimusvuokra</th>
          <th>Käyttötarkoitus</th>
          <th>Vuokranlaskennan perusteena oleva vuokra</th>
          <th>Voimassaoloaika</th>
        </tr>
      </thead>
      <tbody>
        {contractRents && contractRents.length > 0 && contractRents.map((rent, index) => {
          return (
            <tr key={index}>
              <td>
                {rent.contract_rent ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(rent.contract_rent), '.')} ${rent.type ? getRentContractRentTypeLabel(rent.type) : ''}` : '-'}</td>
              <td>{rent.purpose ? getRentContractRentPurposeLabel(rent.purpose) : '-'}</td>
              <td>{rent.basic_rent ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(rent.basic_rent), '.')} ${rent.basic_rent_type ? getRentContractRentTypeLabel(rent.basic_rent_type) : ''}` : '-'}</td>
              <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ContractRent;
