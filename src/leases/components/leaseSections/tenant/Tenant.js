// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {getContactById, getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDateRange} from '$util/helpers';
import {getCompleteContactList} from '$src/contacts/selectors';

import type {Contact} from '$src/contacts/types';

type Props = {
  allContacts: Array<Contact>,
  tenant: Object,
}

const Tenant = ({
  allContacts,
  tenant,
}: Props) => {
  const contact = getContactById(allContacts, get(tenant, 'tenant.contact.id'));
  const isActive = isTenantActive(get(tenant, 'tenant'));

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={isActive}
      header={
        <div>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Osuus murtolukuna:</label>
              {get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}
            </span>
          </Column>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Välillä:</label>
              {formatDateRange(get(tenant, 'tenant.start_date'), get(tenant, 'tenant.end_date')) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={
        <h3 className='collapse__header-title'>{getContactFullName(contact)}</h3>
      }
    >
      <div>
        <TenantItem
          contact={contact}
          tenant={tenant}
        />
        {tenant.tenantcontact_set && !!tenant.tenantcontact_set.length &&
          tenant.tenantcontact_set.map((person) => {
            return (
              <OtherTenantItem
                key={person.id}
                tenant={person}
              />
            );
          })
        }
      </div>
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      allContacts: getCompleteContactList(state),
    };
  },
)(Tenant);
