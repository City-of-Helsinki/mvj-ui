// @flow
import React from 'react';

import {formatNumberWithThousandSeparator} from '../../../../util/helpers';
import Button from '../../../../components/Button';

type Props = {
  criterias: Array<Object>,
}
const RentCriteria = ({criterias}: Props) => {
  return (
    <div>
      <table className="rent-table">
        <thead>
          <tr>
            <th>Käyttötarkoitus</th>
            <th>K-m2</th>
            <th>Indeksi</th>
            <th>€/k-m2 (ind 100)</th>
            <th>€/k-m2 (ind)</th>
            <th>Prosenttia</th>
            <th>Perusvuosivuokra €/v (ind 100)</th>
            <th>Alkuvuosivuokra €/v (ind)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {criterias && criterias.length > 0 && criterias.map((criteria, index) => {
            return (
              <tr key={index}>
                <td>{criteria.purpose ? criteria.purpose : ''}</td>
                <td>{criteria.km2 ? formatNumberWithThousandSeparator(criteria.km2) : ''}</td>
                <td>{criteria.index ? formatNumberWithThousandSeparator(criteria.index) : '-'}</td>
                <td>{criteria.ekm2ind100 ? formatNumberWithThousandSeparator(criteria.ekm2ind100) : '-'}</td>
                <td>{criteria.ekm2ind ? formatNumberWithThousandSeparator(criteria.ekm2ind) : '-'}</td>
                <td>{criteria.percentage ? formatNumberWithThousandSeparator(criteria.percentage) + '%' : '-'}</td>
                <td>{criteria.basic_rent ? formatNumberWithThousandSeparator(criteria.basic_rent) : '-'}</td>
                <td>{criteria.start_rent ? formatNumberWithThousandSeparator(criteria.start_rent) : '-'}</td>
                <td>
                  {criteria.agreed &&
                    <Button
                      className="button-green button-xs no-margin"
                      onClick={() => alert('TODO: Hyväksy vuokranperuste')}
                      text="Hyväksy"
                    />
                  }
                </td>
              </tr>
            );})
          }
        </tbody>
      </table>
    </div>
  );
};

export default RentCriteria;
