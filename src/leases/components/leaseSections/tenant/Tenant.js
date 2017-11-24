// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import Collapse from '../../../../components/Collapse';
import TenantItem from './TenantItem';
import InvoiceRecipientItem from './InvoiceRecipientItem';
import ContactPersonItem from './ContactPersonItem';

type Props = {
  tenant: Object,
}

const Tenant = ({tenant}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Vuokralainen</span></Column>
          </Row>
        }
      >
        <TenantItem customer={get(tenant, 'tenant')} />
      </Collapse>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Laskunsaaja</span></Column>
          </Row>
        }>
        <InvoiceRecipientItem customer={get(tenant, 'invoice_recipient')} />
      </Collapse>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Yhteyshenkilö</span></Column>
          </Row>
        }>
        <ContactPersonItem customer={get(tenant, 'contact_person')} />
      </Collapse>
    </div>
  );
};

export default Tenant;
