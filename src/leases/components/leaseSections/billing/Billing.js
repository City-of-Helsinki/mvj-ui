// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

type Props = {
  billing: Object,
}

const Billing = ({billing}: Props) => {
  return (
    <div className="lease-section billing-section">
      <Row>
        <Column medium={9}><h1>Laskutus</h1></Column>
        <Column medium={3}>
          {billing.billing_started
            ? (<p className="success">Laskutus käynnissä<i /></p>)
            : (<p className="alert">Laskutus ei käynnissä<i /></p>)
          }
        </Column>
      </Row>
    </div>
  );
};

export default Billing;
