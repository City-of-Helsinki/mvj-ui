// @flow
import React from 'react';
import get from 'lodash/get';

import AbnormalDebtsTable from './AbnormalDebtsTable';
import BillsTable from './BillsTable';
import Divider from '$components/content/Divider';
import RightSubtitle from '$components/content/RightSubtitle';

type Props = {
  billing: Object,
}

const Billing = ({billing}: Props) => {
  return (
    <div>
      <h1>Laskutus</h1>
      <RightSubtitle
        className='invoicing-status'
        text={billing.invoicing_started
          ? <p className="success">Laskutus käynnissä<i /></p>
          : <p className="alert">Laskutus ei käynnissä<i /></p>
        }
      />
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
