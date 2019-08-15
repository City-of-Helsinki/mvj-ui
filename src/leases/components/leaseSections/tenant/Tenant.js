// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import OtherTenantItem from './OtherTenantItem';
import TenantItem from './TenantItem';
import {receiveCollapseStates} from '$src/leases/actions';
import {LeaseTenantsFieldPaths, LeaseTenantsFieldTitles, LeaseTenantContactSetFieldPaths} from '$src/leases/enums';
import {FormNames, ViewModes} from '$src/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {
  formatDateRange, 
  isActive,
  isArchived,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  receiveCollapseStates: Function,
  tenant: Object,
}

const Tenant = ({
  attributes,
  collapseState,
  receiveCollapseStates,
  tenant,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_TENANTS]: {
          tenants: {
            [tenant.id]: val,
          },
        },
      },
    });
  };

  const contact = get(tenant, 'tenant.contact');
  const active = isActive(tenant.tenant);
  const archived = isArchived(tenant.tenant);
  const billingPersons = tenant.billing_persons;
  const contactPersons = tenant.contact_persons;

  return (
    <Collapse
      archived={archived}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
              <CollapseHeaderSubtitle>
                <span>{LeaseTenantsFieldTitles.SHARE_FRACTION}:</span>
                {tenant.share_numerator || ''} / {tenant.share_denominator || ''}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE) && isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
              <CollapseHeaderSubtitle>
                <span>Välillä:</span>
                {formatDateRange(get(tenant, 'tenant.start_date'), get(tenant, 'tenant.end_date')) || '-'}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {getContactFullName(contact)}
        </Authorization>
      }
      onToggle={handleCollapseToggle}
    >
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET)}>
        <TenantItem contact={contact} tenant={tenant} />

        {!!billingPersons.length && billingPersons.map((person) =>
          <OtherTenantItem key={person.id} tenant={person} />
        )}

        {!!contactPersons.length && contactPersons.map((person) =>
          <OtherTenantItem key={person.id} tenant={person} />
        )}
      </Authorization>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.tenant.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_TENANTS}.tenants.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(Tenant);
