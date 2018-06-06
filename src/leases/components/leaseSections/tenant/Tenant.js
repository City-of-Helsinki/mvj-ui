// @flow
import React from 'react';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDateRange} from '$util/helpers';

type Props = {
  tenant: Object,
}

const Tenant = ({
  tenant,
}: Props) => {
  const contact = get(tenant, 'tenant.contact');
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

export default Tenant;
