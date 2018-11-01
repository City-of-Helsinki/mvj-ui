// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import moment from 'moment';
import get from 'lodash/get';

import AmountWithVat from '$components/vat/AmountWithVat';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import {getRentsTotalAmount} from '../helpers';

type Props = {
  rents: Array<Object>,
}

const RentCalculatorTotalRow = ({rents}: Props) => {
  const getEndDate = () => {
    let endDate = null;

    rents.forEach((rent) => {
      get(rent, 'explanation.items', []).forEach((explanation) => {
        let rentEndDate = null;

        get(explanation, 'date_ranges', []).forEach((dateRange) => {
          if(dateRange.end_date && (!rentEndDate || moment(dateRange.end_date).isAfter(moment(rentEndDate), 'day'))) {
            rentEndDate = dateRange.end_date;
          }
        });

        if(rentEndDate && (!endDate || moment(rentEndDate).isAfter(moment(endDate), 'day'))) {
          endDate = rentEndDate;
        }
      });
    });

    return endDate;
  };

  if(!rents || rents.length <= 1) {
    return null;
  }

  const amount = getRentsTotalAmount(rents);
  const date = getEndDate();

  return (
    <div className='rent-calculator__rent'>
      <Divider className='invoice-divider' />
      <Row>
        <Column small={4}>
          <FormText><strong>Yhteensä</strong></FormText>
        </Column>
        <Column small={8}>
          <FormText className='rent-calculator__rent_amount'>
            <strong><AmountWithVat amount={amount} date={date} /></strong>
          </FormText>
        </Column>
      </Row>
    </div>
  );
};

export default RentCalculatorTotalRow;
