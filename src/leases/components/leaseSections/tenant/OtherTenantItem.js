// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import {getContactById, getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCompleteContactList} from '$src/contacts/selectors';
import {getAttributes} from '$src/leases/selectors';

import type {Contact} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: Array<Contact>,
  attributes: Attributes,
  tenant: Object,
};

const OtherTenantItem = ({
  allContacts,
  attributes,
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
          <Column></Column>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Välillä:</label>
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
      </Row>
      <Row>
        <Column small={12}>
          <label>Kommentti</label>
          <p>{tenant.note || '-'}</p>
        </Column>
      </Row>
      <ContactTemplate
        contact={contact}
      />
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      allContacts: getCompleteContactList(state),
      attributes: getAttributes(state),
    };
  }
)(OtherTenantItem);
