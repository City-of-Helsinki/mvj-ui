// @flow
import React from 'react';

import InvoicesTable from './InvoicesTable';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import RightSubtitle from '$components/content/RightSubtitle';

import type {InvoiceList} from '$src/invoices/types';

type Props = {
  invoices: InvoiceList,
  isInvoicingEnabled: boolean,
}

const Invoices = ({invoices, isInvoicingEnabled}: Props) => {
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

        <InvoicesTable
          invoices={invoices}
        />
      </Collapse>
    </div>
  );
};

export default Invoices;
