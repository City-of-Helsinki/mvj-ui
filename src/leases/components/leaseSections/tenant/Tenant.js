// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import TenantItem from './TenantItem';
import classnames from 'classnames';

import OtherTenantItem from './OtherTenantItem';

import type {
  Attributes as ContactAttributes,
  ContactList,
} from '$src/contacts/types';
import type {
  Attributes,
} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  tenant: Object,
}

const Tenant = ({
  allContacts,
  attributes,
  contactAttributes,
  tenant,
}: Props) => {
  // const {other_persons} = tenant;
  const findContact = () => {
    if(!allContacts || !allContacts.length) {
      return {};
    }
    return allContacts.find((x) => x.id === get(tenant, 'tenant.contact'));
  };

  const contact: Object = findContact();

  const getFullName = () => {
    if(!contact) {
      return '';
    }
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };

  return (
    <Collapse
      className='no-content-top-padding'
      header={
        <Row>
          <Column small={6} medium={4} large={4}>
            <h3 className='collapse__header-title'>
              {getFullName()}
            </h3>
          </Column>
          <Column small={6} medium={6} large={6}>
            <span className={classnames(
              'collapse__header-subtitle',
              // {'alert': (share_count !== tenant.tenant.share_divider)}
            )}>
              <i/> {get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}
            </span>
          </Column>
        </Row>
      }
    >
      <div>
        <TenantItem
          contact={contact}
          contactAttributes={contactAttributes}
          tenant={tenant}
        />
        {tenant.tenantcontact_set && !!tenant.tenantcontact_set.length &&
          tenant.tenantcontact_set.map((person) => {
            return (
              <OtherTenantItem
                key={person.id}
                allContacts={allContacts}
                attributes={attributes}
                contactAttributes={contactAttributes}
                tenant={person}
              />
            );
          })
        }
      </div>
    </Collapse>
  );
};

export default Tenant;
