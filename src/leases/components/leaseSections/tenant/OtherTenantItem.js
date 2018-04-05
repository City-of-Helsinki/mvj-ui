// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import ContactInfo from './ContactInfo';

import type {
  Attributes as ContactAttributes,
  ContactList,
} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  tenant: Object,
};

const OtherTenantItem = ({
  allContacts,
  attributes,
  contactAttributes,
  tenant,
}: Props) => {
  const getFullName = (contact: Object) => {
    if(!contact) {
      return '';
    }
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };
  const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type');

  const findContact = () => {
    if(!allContacts || !allContacts.length) {
      return {};
    }
    return allContacts.find((x) => x.id === get(tenant, 'contact'));
  };

  const contact: Object = findContact();

  return (
    <Collapse
      className='collapse__secondary no-content-top-padding'
      defaultOpen={true}
      header={
        <Row>
          <Column small={12}>
            <h4 className='collapse__header-title'>
              {getLabelOfOption(tenantTypeOptions, tenant.type)}
            </h4>
          </Column>
        </Row>
      }>
      <Row>
        <Column small={12} medium={6} large={4}>
          <label>Asiakas</label>
          <p>{getFullName(contact)}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Rooli</label>
          <p>{getLabelOfOption(tenantTypeOptions, tenant.type)}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Alkupäivämäärä</label>
          <p>{formatDate(get(tenant, 'start_date')) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Loppupäivämäärä</label>
          <p>{formatDate(get(tenant, 'end_date')) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <label>Kommentti</label>
          <p>{tenant.note || '-'}</p>
        </Column>
      </Row>
      <ContactInfo
        contact={contact}
        contactAttributes={contactAttributes}
      />
    </Collapse>
  );
};

export default OtherTenantItem;
