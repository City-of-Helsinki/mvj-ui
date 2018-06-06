// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatNumber} from '$util/helpers';
import {getRentsTotalAmount} from '../helpers';

type Props = {
  rents: Array<Object>,
}

const TotalRow = ({rents}: Props) => {
  if(!rents || rents.length <= 1) {
    return null;
  }
  const amount = getRentsTotalAmount(rents);

  return (
    <div className='rent-calculator__rent'>
      <div className='rent-calculator__divider' />
      <Row>
        <Column small={10}><p className='no-margin'><strong>Yhteensä</strong></p></Column>
        <Column small={2}><p className='no-margin rent-calculator__rent_amount'><strong>{`${formatNumber(amount)} €`}</strong></p></Column>
      </Row>
    </div>
  );
};

export default TotalRow;
