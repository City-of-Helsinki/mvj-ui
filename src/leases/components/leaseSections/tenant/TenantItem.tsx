import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "/src/components/authorization/Authorization";
import ContactTemplate from "/src/contacts/components/templates/ContactTemplate";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormWrapper from "/src/components/form/FormWrapper";
import FormWrapperLeft from "/src/components/form/FormWrapperLeft";
import FormWrapperRight from "/src/components/form/FormWrapperRight";
import SubTitle from "/src/components/content/SubTitle";
import { LeaseTenantsFieldPaths, LeaseTenantsFieldTitles, LeaseTenantContactSetFieldPaths, LeaseTenantContactSetFieldTitles, LeaseTenantRentSharesFieldPaths, LeaseTenantRentSharesFieldTitles } from "/src/leases/enums";
import { getContactFullName } from "/src/contacts/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { formatDate, getFieldOptions, getLabelOfOption, isFieldAllowedToRead } from "util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getAttributes } from "/src/leases/selectors";
import type { Attributes } from "types";
type RentSharesProps = {
  attributes: Attributes;
  intendedUseOptions: Array<Record<string, any>>;
  rentShares: Array<Record<string, any>>;
};

const RentShares = ({
  attributes,
  intendedUseOptions,
  rentShares
}: RentSharesProps) => {
  return <Fragment>
      <SubTitle>{LeaseTenantRentSharesFieldTitles.RENT_SHARES}</SubTitle>
      {!rentShares.length && <FormText>Ei laskutusosuuksia</FormText>}

      {!!rentShares.length && <Fragment>
          <Row>
            <Column small={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)}>
                <FormTextTitle>
                  {LeaseTenantRentSharesFieldTitles.INTENDED_USE}
                </FormTextTitle>
              </Authorization>
            </Column>
            <Column small={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR) || isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                <FormTextTitle>
                  {LeaseTenantRentSharesFieldTitles.SHARE_FRACTION}
                </FormTextTitle>
              </Authorization>
            </Column>
          </Row>
          {rentShares.map((rentShare, index) => {
        return <Row key={index}>
                <Column small={6} medium={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)}>
                    <FormText>{getLabelOfOption(intendedUseOptions, rentShare.intended_use) || ''}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR) || isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                    <FormText>{rentShare.share_numerator || ''} / {rentShare.share_denominator || ''}</FormText>
                  </Authorization>
                </Column>
              </Row>;
      })}
        </Fragment>}
    </Fragment>;
};

type Props = {
  attributes: Attributes;
  contact: Record<string, any> | null | undefined;
  tenant: Record<string, any>;
};

const TenantItem = ({
  attributes,
  contact,
  tenant
}: Props) => {
  const rentShares = tenant.rent_shares;
  const intendedUseOptions = getFieldOptions(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE);
  if (!contact) return null;
  return <Fragment>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.CONTACT)}>
                  {LeaseTenantContactSetFieldTitles.CONTACT}
                </FormTextTitle>
                <FormText>
                  {contact ? <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${contact.id}`} text={getContactFullName(contact)} /> : '-'}
                </FormText>
              </Authorization>
            </Column>
          </Row>

          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.REFERENCE)}>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.REFERENCE)}>
                  {LeaseTenantsFieldTitles.REFERENCE}
                </FormTextTitle>
                <FormText>{tenant.reference || '-'}</FormText>
              </Authorization>
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.SHARE_FRACTION)}>
                  {LeaseTenantsFieldTitles.SHARE_FRACTION}
                </FormTextTitle>
                <FormText>{tenant.share_numerator || ''} / {tenant.share_denominator || ''}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.START_DATE)}>
                  {LeaseTenantContactSetFieldTitles.START_DATE}
                </FormTextTitle>
                <FormText>{formatDate(get(tenant, 'tenant.start_date'))}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={3} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.END_DATE)}>
                  {LeaseTenantContactSetFieldTitles.END_DATE}
                </FormTextTitle>
                <FormText>{formatDate(get(tenant, 'tenant.end_date'))}</FormText>
              </Authorization>
            </Column>
          </Row>

          <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.RENT_SHARES)}>
            <Row>
              <Column small={12}>
                <RentShares attributes={attributes} intendedUseOptions={intendedUseOptions} rentShares={rentShares} />
              </Column>
            </Row>
          </Authorization>
        </FormWrapperRight>
      </FormWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
        <SubTitle>Asiakkaan tiedot</SubTitle>
        <ContactTemplate contact={contact} />
      </Authorization>
    </Fragment>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state)
  };
})(TenantItem);