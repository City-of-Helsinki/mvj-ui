// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {receiveCollapseStates} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {ViewModes} from '$src/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDateRange} from '$util/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';

type Props = {
  collapseState: boolean,
  receiveCollapseStates: Function,
  tenant: Object,
}

const Tenant = ({
  collapseState,
  receiveCollapseStates,
  tenant,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
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
  const billingPersons = get(tenant, 'billing_persons', []);
  const contactPersons = get(tenant, 'contact_persons', []);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      headerSubtitles={
        <Fragment>
          <Column>
            <CollapseHeaderSubtitle><span>Osuus murtolukuna:</span> {get(tenant, 'share_numerator', '')} / {get(tenant, 'share_denominator', '')}</CollapseHeaderSubtitle>
          </Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(get(tenant, 'tenant.start_date'), get(tenant, 'tenant.end_date')) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>
      }
      headerTitle={<CollapseHeaderTitle>{getContactFullName(contact)}</CollapseHeaderTitle>}
      onToggle={handleCollapseToggle}
    >
      <div>
        <TenantItem
          contact={contact}
          tenant={tenant}
        />
        {!!billingPersons.length &&
          billingPersons.map((person) => {
            return (
              <OtherTenantItem
                key={person.id}
                tenant={person}
              />
            );
          })
        }

        {!!contactPersons.length &&
          contactPersons.map((person) => {
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
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.TENANTS}.tenants.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(Tenant);
