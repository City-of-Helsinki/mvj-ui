// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import GreenBoxItem from '$components/content/GreenBoxItem';
import {formatDate, getLabelOfOption} from '$util/helpers';
import {rentDiscountTypeOptions} from '../constants';
import {decisionOptions, purposeOptions} from '$src/constants';

type Props = {
  discounts: Array<Object>,
}

const Discounts = ({discounts}: Props) => {
  return (
    <div>
      {discounts && discounts.length > 0 &&
        discounts.map((discount, index) => {
          return (
            <GreenBoxItem  className='no-border-on-first-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <label>Tyyppi</label>
                  <p>{getLabelOfOption(rentDiscountTypeOptions, discount.type) || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Käyttötarkoitus</label>
                  <p>{getLabelOfOption(purposeOptions, discount.purpose) || '-'}</p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <label>Alkupvm</label>
                      <p>{formatDate(discount.start_date) || '-'}</p>
                    </Column>
                    <Column small={6}>
                      <label>Loppupvm</label>
                      <p>{formatDate(discount.end_date) || '-'}</p>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Kokonaismäärä</label>
                  <p>
                    {discount.amount ? `${discount.amount} ` : '-'}
                    {discount.amount_type === '0' && <span>%/v</span>}
                    {discount.amount_type === '1' && <span>%</span>}
                    {discount.amount_type === '2' && <span>€/v</span>}
                    {discount.amount_type === '3' && <span>€</span>}
                  </p>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Jäljellä (€)</label>
                  {discount.amount_left || '-'}
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label>Päätös</label>
                  {discount.rule ? <a>{getLabelOfOption(decisionOptions, discount.rule) || '-'}<span className="link-icon"/></a> : '-'}
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>Kommentti</label>
                  <p>{discount.comment || '-'}</p>
                </Column>
              </Row>
            </GreenBoxItem>
          );
        })
      }
    </div>
  );
};

export default Discounts;
