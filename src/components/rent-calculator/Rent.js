// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Explanation from './Explanation';
import {formatDateRange, formatNumber} from '$util/helpers';
import {getRentAmount} from '../helpers';

type Props = {
  rent: Object,
}

const Rent = ({rent}: Props) => {
  const explanations = get(rent, 'explanation.items');
  const amount = getRentAmount(rent);

  return (
    <div className='rent-calculator__rent'>
      <Row>
        <Column>
          <p>
            <strong>{formatDateRange(rent.start_date, rent.end_date)}</strong>
          </p>
        </Column>
      </Row>
      {explanations && explanations.length &&
        explanations.map((explanation, index) => {
          return <Explanation
            key={index}
            explanation={explanation}
          />;
        })
      }
      <div className='rent-calculator__divider' />
      <Row>
        <Column small={10}><p className='no-margin'><strong>Yhteensä</strong></p></Column>
        <Column small={2}><p className='no-margin rent-calculator__rent_amount'><strong>{`${formatNumber(amount)} €`}</strong></p></Column>
      </Row>
    </div>
  );
};

export default Rent;
