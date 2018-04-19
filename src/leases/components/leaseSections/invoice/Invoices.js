// @flow
import React from 'react';

import InvoicesTable from './InvoicesTable';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import RightSubtitle from '$components/content/RightSubtitle';

import type {Attributes as InvoiceAttributes, InvoiceList} from '$src/invoices/types';

type Props = {
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
  isInvoicingEnabled: boolean,
}

const Invoices = ({invoiceAttributes, invoices, isInvoicingEnabled}: Props) => {
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
          invoiceAttributes={invoiceAttributes}
          invoices={invoices}
        />
      </Collapse>
    </div>
  );
};

export default Invoices;
