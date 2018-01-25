// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDateRange} from '../../../../util/helpers';

type Props = {
  discounts: Array<Object>,
}

const Discounts = ({discounts}: Props) => {
  return (
    <div className="green-box no-margin">
      <div className="section-item">
        {discounts && discounts.length > 0 &&
          discounts.map((discount, index) => {
            return (
              <div className="discount-item" key={index}>
                <Row>
                  <Column medium={6}>
                    <Row>
                      <Column small={3}>
                        <label>Tyyppi</label>
                        <p>{discount.type ? discount.type : '-'}</p>
                      </Column>
                      <Column small={3}>
                        <label>Käyttötarkoitus</label>
                        <p>{discount.purpose ? discount.purpose : '-'}</p>
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
                        <p>{discount.amount ? `${discount.amount} %` : '-'}</p>
                      </Column>
                      <Column small={6}>
                        <label>Päätös</label>
                        {discount.rule ? <a>{discount.rule}<span className="link-icon"/></a> : '-'}
                      </Column>
                    </Row>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <label>Kommentti</label>
                    <p>{discount.comment ? discount.comment : '-'}</p>
                  </Column>
                </Row>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Discounts;
