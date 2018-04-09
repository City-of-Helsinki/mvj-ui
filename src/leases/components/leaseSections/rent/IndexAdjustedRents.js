// @flow
import React from 'react';

import {
  formatDateRange,
  formatNumberWithThousandSeparator,
  formatDecimalNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import TableFixedHeader from '$components/table/TableFixedHeader';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  indexAdjustedRents: Array<Object>,
}

const getTableBody = (indexAdjustedRents: Array<Object>, intendedUseOptions: Array<Object>) => {
  if(indexAdjustedRents && !!indexAdjustedRents.length) {
    return (
      <tbody>
        {indexAdjustedRents.map((rent, index) => (
          <tr key={index}>
            <td>{formatNumberWithThousandSeparator(formatDecimalNumber(rent.amount), '.') || '-'}</td>
            <td>{getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}</td>
            <td>{formatDateRange(rent.start_date, rent.end_date)}</td>
            <td>{formatDecimalNumber(rent.factor) || '-'}</td>
          </tr>
        ))}
      </tbody>
    );
  }
  else {
    return (
      <tbody><tr className='no-data'><td colSpan={4}>Ei Indeksitarkistettuja vuokria</td></tr></tbody>
    );
  }
};

const IndexAdjustedRents = ({attributes, indexAdjustedRents}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.index_adjusted_rents.child.children.intended_use');
  return (
    <TableFixedHeader
      headers={[
        'Indeksitarkastettu vuokra (€)',
        'Käyttötarkoitus',
        'Voimassaoloaika',
        'Laskentakerroin',
      ]}
      body={getTableBody(indexAdjustedRents, intendedUseOptions)}
    />
  );
};

export default IndexAdjustedRents;
