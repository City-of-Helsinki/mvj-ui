// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {receiveCollapseStatuses} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {ViewModes} from '$src/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDateRange} from '$util/helpers';
import {getCollapseStatusByKey} from '$src/leases/selectors';

type Props = {
  collapseStatus: boolean,
  receiveCollapseStatuses: Function,
  tenant: Object,
}

const Tenant = ({
  collapseStatus,
  receiveCollapseStatuses,
  tenant,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.TENANTS]: {
          tenants: {
            [tenant.id]: val,
          },
        },
      },
    });
  };

  const contact = get(tenant, 'tenant.contact');
  const isActive = isTenantActive(get(tenant, 'tenant'));
  const collapseDefault = collapseStatus !== undefined ? collapseStatus : isActive;

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseDefault}
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
      onToggle={handleCollapseToggle}
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
  (state, props) => {
    const id = props.tenant.id;
    return {
      collapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.TENANTS}.tenants.${id}`),
    };
  },
  {
    receiveCollapseStatuses,
  }
)(Tenant);
