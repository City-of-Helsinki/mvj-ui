// @flow
import React from 'react';

import Button from '../../../../components/Button';

const RentCriteria = () => {
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
          <tr>
            <td>Asunto</td>
            <td>120</td>
            <td>1880</td>
            <td>18</td>
            <td>39</td>
            <td>4%</td>
            <td>2 356</td>
            <td>2 876</td>
            <td>
              <Button
                className="button-green button-xs no-margin"
                text="Hyväksy"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RentCriteria;
