// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDate, formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  tenant: Object,
};

const OtherTenantItem = ({
  attributes,
  tenant,
}: Props) => {
  const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type');
  const contact = get(tenant, 'contact');
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
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
              <label>Asiakas</label>
              <p>{getContactFullName(contact)}</p>
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <label>Rooli</label>
              <p>{getLabelOfOption(tenantTypeOptions, tenant.type) || '-'}</p>
            </Column>

            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <label>Alkupvm</label>
                  <p>{formatDate(get(tenant, 'start_date')) || '-'}</p>
                </Column>
                <Column>
                  <label>Loppupvm</label>
                  <p>{formatDate(get(tenant, 'end_date')) || '-'}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>
      <ContactTemplate
        contact={contact}
      />
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(OtherTenantItem);
