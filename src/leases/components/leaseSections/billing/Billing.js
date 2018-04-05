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
      <h2>Laskutus</h2>
      <RightSubtitle
        className='invoicing-status'
        text={billing.invoicing_started
          ? <p className="success">Laskutus käynnissä<i /></p>
          : <p className="alert">Laskutus ei käynnissä<i /></p>
        }
      />
      <Divider />
      <h3>Laskut</h3>
      <BillsTable
        bills={get(billing, 'bills')}
      />

      <h3>Poikkeavat perinnät</h3>
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
