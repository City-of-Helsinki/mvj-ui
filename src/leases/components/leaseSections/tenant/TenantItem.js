// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {
  formatDate,
  formatNumber,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  contact: ?Object,
  tenant: Object,
};

const TenantItem = ({
  attributes,
  contact,
  tenant,
}: Props) => {
  const getInvoiceManagementShare = () => {
    if(!Number(tenant.share_numerator) || !Number(tenant.share_denominator)) return null;

    return (Number(tenant.share_numerator)*100/Number(tenant.share_denominator));
  };

  const share = getInvoiceManagementShare();

  if(!contact) return null;

  return (
    <Fragment>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.CONTACT}</FormTextTitle>
                <FormText>
                  {contact
                    ? <ExternalLink
                      className='no-margin'
                      href={`${getRouteById(Routes.CONTACTS)}/${contact.id}`}
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
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                <FormTextTitle>{LeaseTenantsFieldTitles.SHARE_FRACTION}</FormTextTitle>
                <FormText>{tenant.share_numerator || ''} / {tenant.share_denominator || ''}</FormText>
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                <FormTextTitle>{LeaseTenantsFieldTitles.SHARE_PERCENTAGE}</FormTextTitle>
                <FormText>{!isEmptyValue(share) ? `${formatNumber(share)} %` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.START_DATE}</FormTextTitle>
                <FormText>{formatDate(get(tenant, 'tenant.start_date'))}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                <FormTextTitle>{LeaseTenantContactSetFieldTitles.END_DATE}</FormTextTitle>
                <FormText>{formatDate(get(tenant, 'tenant.end_date'))}</FormText>
              </Authorization>
            </Column>
          </Row>
        </FormWrapperRight>

        <FormWrapperLeft>
          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.REFERENCE)}>
                <FormTextTitle>{LeaseTenantsFieldTitles.REFERENCE}</FormTextTitle>
                <FormText>{tenant.reference || '-'}</FormText>
              </Authorization>
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
        <SubTitle>Asiakkaan tiedot</SubTitle>
        <ContactTemplate contact={contact} />
      </Authorization>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(TenantItem);
