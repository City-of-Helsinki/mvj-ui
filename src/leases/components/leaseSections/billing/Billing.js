// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AbnormalDebtsTable from './AbnormalDebtsTable';
import BillsTable from './BillsTable';
import Divider from '$components/content/Divider';

type Props = {
  billing: Object,
}

const Billing = ({billing}: Props) => {
  return (
    <div className="lease-section billing-section">
      <Row>
        <Column medium={9}>
          <h1>Laskutus</h1>
        </Column>
        <Column medium={3}>
          {billing.billing_started
            ? (<p className="success">Laskutus käynnissä<i /></p>)
            : (<p className="alert">Laskutus ei käynnissä<i /></p>)
          }
        </Column>
      </Row>
      <Divider />
      <h2>Laskut</h2>
      <BillsTable
        bills={get(billing, 'bills')}
      />
      <h2>Poikkeavat perinnät</h2>
      <AbnormalDebtsTable
        headers={[
          'Vuokraaja',
          'Hallintaosuus',
          'Eräpäivä',
          'Määrä',
          'Aikaväli',
        ]}
        debts={get(billing, 'abnormal_debts')}
      />
    </div>
  );
};

export default Billing;
