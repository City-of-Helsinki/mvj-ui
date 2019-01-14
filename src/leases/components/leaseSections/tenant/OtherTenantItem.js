// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {
  formatDate,
  formatDateRange,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  receiveCollapseStates: Function,
  tenant: Object,
};

const OtherTenantItem = ({
  attributes,
  collapseState,
  receiveCollapseStates,
  tenant,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.TENANTS]: {
          others: {
            [tenant.id]: val,
          },
        },
      },
    });
  };

  const tenantTypeOptions = getFieldOptions(attributes, LeaseTenantContactSetFieldPaths.TYPE);
  const contact = get(tenant, 'contact');
  const isActive = isTenantActive(tenant);
  const collapseDefault = collapseState !== undefined ? collapseState : isActive;

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={collapseDefault}
      headerSubtitles={
        <Fragment>
          <Column></Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE) && isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
              <CollapseHeaderSubtitle>
                <span>Välillä:</span>
                {formatDateRange(tenant.start_date, tenant.end_date) || '-'}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TYPE)}>
          {getLabelOfOption(tenantTypeOptions, tenant.type)}
        </Authorization>
      }
      onToggle={handleCollapseToggle}
    >
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.CONTACT}</FormTextTitle>
                <FormText>
                  {contact
                    ? <ExternalLink
                      className='no-margin'
                      href={`${getRouteById('contacts')}/${contact.id}`}
                      text={getContactFullName(contact)}
                    />
                    : '-'
                  }
                </FormText>
              </Authorization>
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.START_DATE}</FormTextTitle>
                <FormText>{formatDate(tenant.start_date)}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.END_DATE}</FormTextTitle>
                <FormText>{formatDate(tenant.end_date)}</FormText>
              </Authorization>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
        <SubTitle>Asiakkaan tiedot</SubTitle>
        <ContactTemplate contact={contact} />
      </Authorization>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.tenant.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.TENANTS}.others.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(OtherTenantItem);
