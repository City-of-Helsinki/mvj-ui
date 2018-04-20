// @flow
import React from 'react';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import RightSubtitle from '$components/content/RightSubtitle';

type Props = {
  isInvoicingEnabled: boolean,
}

const Invoices = ({isInvoicingEnabled}: Props) => {
  return (
    <div>
      <h2>Laskutus</h2>
      <RightSubtitle
        className='invoicing-status'
        text={isInvoicingEnabled
          ? <p className="success">Laskutus käynnissä<i /></p>
          : <p className="alert">Laskutus ei käynnissä<i /></p>
        }
      />
      <Divider />
      <Collapse
        defaultOpen={true}
        headerTitle={
          <h3 className='collapse__header-title'>Laskut</h3>
        }>

        <InvoicesTable/>
      </Collapse>
    </div>
  );
};

export default Invoices;
