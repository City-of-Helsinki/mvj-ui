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
  const {other_persons} = tenant;

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
      {other_persons && other_persons.length && other_persons.map((person, index) => {
        switch(person.type) {
          case 'invoice_recipient':
            return (
              <Collapse
                key={index}
                className='collapse__secondary'
                defaultOpen={true}
                header={
                  <Row>
                    <Column small={6}><span className='collapse__header-title-nocap'>Laskunsaaja</span></Column>
                  </Row>
                }>
                <InvoiceRecipientItem customer={person} />
              </Collapse>
            );
          case 'contact_person':
            return (
              <Collapse
                key={index}
                className='collapse__secondary'
                defaultOpen={true}
                header={
                  <Row>
                    <Column small={6}><span className='collapse__header-title-nocap'>Yhteyshenkilö</span></Column>
                  </Row>
                }>
                <ContactPersonItem customer={person} />
              </Collapse>
            );
        }
      })}
    </div>
  );
};

export default Tenant;
