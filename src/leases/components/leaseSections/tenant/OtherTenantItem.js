// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import {formatDate, formatDateRange, getAttributeFieldOptions, getContactById, getLabelOfOption} from '$util/helpers';
import Collapse from '$components/collapse/Collapse';
import ContactInfoTemplate from '$src/contacts/components/ContactInfoTemplate';
import {getContactFullName, isTenantActive} from '$src/leases/helpers';

import type {Attributes as ContactAttributes, Contact} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: Array<Contact>,
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
  const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type');
  const contact = getContactById(allContacts, get(tenant, 'contact'));
  const isActive = isTenantActive(tenant);

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={isActive}
      header={
        <div>
          <Column>
            <span className={'collapse__header-subtitle'}>
              {formatDateRange(get(tenant, 'start_date'), get(tenant, 'end_date')) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={
        <h4 className='collapse__header-title'>{getLabelOfOption(tenantTypeOptions, tenant.type)}</h4>
      }>
      <Row>
        <Column small={12} medium={6} large={4}>
          <label>Asiakas</label>
          <p>{getContactFullName(contact)}</p>
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
      <ContactInfoTemplate
        attributes={contactAttributes}
        contact={contact}
      />
    </Collapse>
  );
};

export default OtherTenantItem;
