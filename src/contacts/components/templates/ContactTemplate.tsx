import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "/src/components/authorization/Authorization";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormWrapper from "/src/components/form/FormWrapper";
import FormWrapperLeft from "/src/components/form/FormWrapperLeft";
import FormWrapperRight from "/src/components/form/FormWrapperRight";
import { ContactFieldPaths, ContactFieldTitles } from "/src/contacts/enums";
import { getUiDataContactKey } from "/src/uiData/helpers";
import { getFieldOptions, getLabelOfOption, isFieldAllowedToRead } from "util/helpers";
import { getAttributes } from "/src/contacts/selectors";
import { ContactTypes } from "/src/contacts/enums";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  contact: Record<string, any> | null | undefined;
};

const ContactTemplate = ({
  attributes,
  contact
}: Props) => {
  const typeOptions = getFieldOptions(attributes, ContactFieldPaths.TYPE);
  const countryOptions = getFieldOptions(attributes, ContactFieldPaths.COUNTRY);
  const languageOptions = getFieldOptions(attributes, ContactFieldPaths.LANGUAGE);
  if (!contact) return null;
  return <FormWrapper>
      <FormWrapperLeft>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.TYPE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.TYPE)}>
                {ContactFieldTitles.TYPE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(typeOptions, contact.type) || '-'}</FormText>
            </Authorization>
          </Column>
          {contact.type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LAST_NAME)}>
                <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.LAST_NAME)}>
                  {ContactFieldTitles.LAST_NAME}
                </FormTextTitle>
                <FormText>{contact.last_name || '-'}</FormText>
              </Authorization>
            </Column>}
          {contact.type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.FIRST_NAME)}>
                <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.FIRST_NAME)}>
                  {ContactFieldTitles.FIRST_NAME}
                </FormTextTitle>
                <FormText>{contact.first_name || '-'}</FormText>
              </Authorization>
            </Column>}
          {contact.type && contact.type !== ContactTypes.PERSON && <Column small={12} medium={6} large={8}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NAME)}>
                <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.NAME)}>
                  {ContactFieldTitles.NAME}
                </FormTextTitle>
                <FormText>{contact.name || '-'}</FormText>
              </Authorization>
            </Column>}
        </Row>
        <Row>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CARE_OF)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.CARE_OF)}>
                {ContactFieldTitles.CARE_OF}
              </FormTextTitle>
              <FormText>{contact.care_of || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ADDRESS)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.ADDRESS)}>
                {ContactFieldTitles.ADDRESS}
              </FormTextTitle>
              <FormText>{contact.address || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.POSTAL_CODE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.POSTAL_CODE)}>
                {ContactFieldTitles.POSTAL_CODE}
              </FormTextTitle>
              <FormText>{contact.postal_code || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CITY)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.CITY)}>
                {ContactFieldTitles.CITY}
              </FormTextTitle>
              <FormText>{contact.city || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.COUNTRY)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.COUNTRY)}>
                {ContactFieldTitles.COUNTRY}
              </FormTextTitle>
              <FormText>{getLabelOfOption(countryOptions, contact.country) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PHONE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.PHONE)}>
                {ContactFieldTitles.PHONE}
              </FormTextTitle>
              <FormText>{contact.phone || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.EMAIL)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.EMAIL)}>
                {ContactFieldTitles.EMAIL}
              </FormTextTitle>
              <FormText>{contact.email || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
      </FormWrapperLeft>
      <FormWrapperRight>
        <Row>
          {contact.type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)}>
                <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)}>
                  {ContactFieldTitles.NATIONAL_IDENTIFICATION_NUMBER}
                </FormTextTitle>
                <FormText>{contact.national_identification_number || '-'}</FormText>
              </Authorization>
            </Column>}
          {contact.type && contact.type !== ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.BUSINESS_ID)}>
                <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.BUSINESS_ID)}>
                  {ContactFieldTitles.BUSINESS_ID}
                </FormTextTitle>
                <FormText>{contact.business_id || '-'}</FormText>
              </Authorization>
            </Column>}
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LANGUAGE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.LANGUAGE)}>
                {ContactFieldTitles.LANGUAGE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(languageOptions, contact.language) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.SAP_CUSTOMER_NUMBER)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.SAP_CUSTOMER_NUMBER)}>
                {ContactFieldTitles.SAP_CUSTOMER_NUMBER}
              </FormTextTitle>
              <FormText>{contact.sap_customer_number || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PARTNER_CODE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.PARTNER_CODE)}>
                {ContactFieldTitles.PARTNER_CODE}
              </FormTextTitle>
              <FormText>{contact.partner_code || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)}>
                {ContactFieldTitles.ELECTRONIC_BILLING_ADDRESS}
              </FormTextTitle>
              <FormText>{contact.electronic_billing_address || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ID)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.ID)}>
                {ContactFieldTitles.ID}
              </FormTextTitle>
              <FormText>{contact.id || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.IS_LESSOR)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.IS_LESSOR)}>
                {ContactFieldTitles.IS_LESSOR}
              </FormTextTitle>
              <FormText>{contact.is_lessor ? 'Kyllä' : 'Ei'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.SERVICE_UNIT)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.SERVICE_UNIT)}>
                {ContactFieldTitles.SERVICE_UNIT}
              </FormTextTitle>
              <FormText>{contact.service_unit && contact.service_unit.name ? contact.service_unit.name : '-'}</FormText>
            </Authorization>
          </Column>
          {contact.type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.ADDRESS_PROTECTION)}>
                {ContactFieldTitles.ADDRESS_PROTECTION}
              </FormTextTitle>
              <FormText>{contact.address_protection ? <span><i /><span>Turvakielto</span></span> : 'Ei turvakieltoa'}</FormText>
            </Column>}
        </Row>
        <Row>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NOTE)}>
              <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.NOTE)}>
                {ContactFieldTitles.NOTE}
              </FormTextTitle>
              <FormText>{contact.note || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
      </FormWrapperRight>
    </FormWrapper>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state)
  };
})(ContactTemplate);