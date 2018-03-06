// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import GreenBox from '$components/content/GreenBox';
import GreenBoxItem from '$components/content/GreenBoxItem';
import {formatDateRange, getLabelOfOption} from '$util/helpers';
import {rentDiscountTypeOptions} from '../constants';
import {decisionOptions, purposeOptions} from '$src/constants';

type Props = {
  discounts: Array<Object>,
}

const Discounts = ({discounts}: Props) => {
  return (
    <GreenBox className='no-margin'>
      {discounts && discounts.length > 0 &&
        discounts.map((discount, index) => {
          return (
            <GreenBoxItem  className='no-border-on-first-child' key={index}>
              <Row>
                <Column medium={6}>
                  <Row>
                    <Column small={3}>
                      <label>Tyyppi</label>
                      <p>{getLabelOfOption(rentDiscountTypeOptions, discount.type) || '-'}</p>
                    </Column>
                    <Column small={3}>
                      <label>Käyttötarkoitus</label>
                      <p>{getLabelOfOption(purposeOptions, discount.purpose) || '-'}</p>
                    </Column>
                    <Column small={6}>
                      <label>Voimassaoloaika</label>
                      <p>{formatDateRange(discount.start_date, discount.end_date)}</p>
                    </Column>
                  </Row>
                </Column>
                <Column medium={6}>
                  <Row>
                    <Column small={6}>
                      <label>Määrä</label>
                      <p>
                        {discount.amount ? `${discount.amount} ` : '-'}
                        {discount.amount_type === '0' && <span>%/v</span>}
                        {discount.amount_type === '1' && <span>%</span>}
                        {discount.amount_type === '2' && <span>€/v</span>}
                        {discount.amount_type === '3' && <span>€</span>}
                      </p>
                    </Column>
                    <Column small={6}>
                      <label>Päätös</label>
                      {discount.rule ? <a>{getLabelOfOption(decisionOptions, discount.rule) || '-'}<span className="link-icon"/></a> : '-'}
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Kommentti</label>
                  <p className='no-margin'>{discount.comment || '-'}</p>
                </Column>
              </Row>
            </GreenBoxItem>
          );
        })
      }
    </GreenBox>
  );
};

export default Discounts;
