// @flow
import React from 'react';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {formatDateRange} from '$util/helpers';
import {isTenantActive} from '$src/leases/helpers';

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
  const isActive = isTenantActive(get(tenant, 'tenant'));

  const getFullName = () => {
    if(!contact) {
      return '';
    }
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={isActive}
      header={
        <div>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <i/> {get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}
            </span>
          </Column>
          <Column>
            <span className={'collapse__header-subtitle'}>
              {formatDateRange(get(tenant, 'tenant.start_date'), get(tenant, 'tenant.end_date')) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={
        <h3 className='collapse__header-title'>{getFullName()}</h3>
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
