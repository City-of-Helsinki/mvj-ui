// @flow
import React from 'react';
import get from 'lodash/get';

import AbnormalDebtsTable from './AbnormalDebtsTable';
import BillsTable from './BillsTable';

type Props = {
  billing: Object,
}

const Billing = ({billing}: Props) => {
  return (
    <div className="lease-section billing-section">
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
