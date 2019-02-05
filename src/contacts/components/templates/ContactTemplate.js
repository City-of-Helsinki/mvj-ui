// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {ContactFieldPaths, ContactFieldTitles} from '$src/contacts/enums';
import {getFieldOptions, getLabelOfOption, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes} from '$src/contacts/selectors';
import {ContactTypes} from '$src/contacts/enums';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  contact: ?Object,
}

const ContactTemplate = ({attributes, contact}: Props) => {
  const typeOptions = getFieldOptions(attributes, ContactFieldPaths.TYPE);
  const languageOptions = getFieldOptions(attributes, ContactFieldPaths.LANGUAGE);

  if(!contact) return null;

  return (
    <FormWrapper>
      <FormWrapperLeft>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.TYPE)}>
              <FormTextTitle>{ContactFieldTitles.TYPE}</FormTextTitle>
              <FormText>{getLabelOfOption(typeOptions, contact.type) || '-'}</FormText>
            </Authorization>
          </Column>
          {contact.type === ContactTypes.PERSON &&
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LAST_NAME)}>
                <FormTextTitle>{ContactFieldTitles.LAST_NAME}</FormTextTitle>
                <FormText>{contact.last_name || '-'}</FormText>
              </Authorization>
            </Column>
          }
          {contact.type === ContactTypes.PERSON &&
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.FIRST_NAME)}>
                <FormTextTitle>{ContactFieldTitles.FIRST_NAME}</FormTextTitle>
                <FormText>{contact.first_name || '-'}</FormText>
              </Authorization>
            </Column>
          }
          {contact.type && contact.type !== ContactTypes.PERSON &&
            <Column small={12} medium={6} large={8}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NAME)}>
                <FormTextTitle>{ContactFieldTitles.NAME}</FormTextTitle>
                <FormText>{contact.name || '-'}</FormText>
              </Authorization>
            </Column>
          }
        </Row>
        <Row>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ADDRESS)}>
              <FormTextTitle>{ContactFieldTitles.ADDRESS}</FormTextTitle>
              <FormText>{contact.address || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.POSTAL_CODE)}>
              <FormTextTitle>{ContactFieldTitles.POSTAL_CODE}</FormTextTitle>
              <FormText>{contact.postal_code || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CITY)}>
              <FormTextTitle>{ContactFieldTitles.CITY}</FormTextTitle>
              <FormText>{contact.city || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={4}>
            {/* <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.COUNTRY)}>
              <FormTextTitle>{ContactFieldTitles.COUNTRY}</FormTextTitle>
              <FormText>{contact.country || '-'}</FormText>
            </Authorization> */}
            {/* TODO: Wrap field with Authorization component when implemented to BE */}
            <FormTextTitle>{ContactFieldTitles.COUNTRY}</FormTextTitle>
            <FormText>{contact.country || '-'}</FormText>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PHONE)}>
              <FormTextTitle>{ContactFieldTitles.PHONE}</FormTextTitle>
              <FormText>{contact.phone || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.EMAIL)}>
              <FormTextTitle>{ContactFieldTitles.EMAIL}</FormTextTitle>
              <FormText>{contact.email || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
      </FormWrapperLeft>
      <FormWrapperRight>
        <Row>
          {contact.type === ContactTypes.PERSON &&
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)}>
                <FormTextTitle>{ContactFieldTitles.NATIONAL_IDENTIFICATION_NUMBER}</FormTextTitle>
                <FormText>{contact.national_identification_number || '-'}</FormText>
              </Authorization>
            </Column>
          }
          {contact.type && contact.type !== ContactTypes.PERSON &&
            <Column small={12} medium={6} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.BUSINESS_ID)}>
                <FormTextTitle>{ContactFieldTitles.BUSINESS_ID}</FormTextTitle>
                <FormText>{contact.business_id || '-'}</FormText>
              </Authorization>
            </Column>
          }
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LANGUAGE)}>
              <FormTextTitle>{ContactFieldTitles.LANGUAGE}</FormTextTitle>
              <FormText>{getLabelOfOption(languageOptions, contact.language) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.SAP_CUSTOMER_NUMBER)}>
              <FormTextTitle>{ContactFieldTitles.SAP_CUSTOMER_NUMBER}</FormTextTitle>
              <FormText>{contact.sap_customer_number || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PARTNER_CODE)}>
              <FormTextTitle>{ContactFieldTitles.PARTNER_CODE}</FormTextTitle>
              <FormText>{contact.partner_code || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)}>
              <FormTextTitle>{ContactFieldTitles.ELECTRONIC_BILLING_ADDRESS}</FormTextTitle>
              <FormText>{contact.electronic_billing_address || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CUSTOMER_NUMBER)}>
              <FormTextTitle>{ContactFieldTitles.CUSTOMER_NUMBER}</FormTextTitle>
              <FormText>{contact.customer_number || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ADDRESS_PROTECTION)}>
              <FormTextTitle>{ContactFieldTitles.ADDRESS_PROTECTION}</FormTextTitle>
              <FormText>{contact.address_protection
                ? <span><i/><span>Turvakielto</span></span>
                : 'Ei turvakieltoa'
              }</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={4}>
            <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.IS_LESSOR)}>
              <FormTextTitle>{ContactFieldTitles.IS_LESSOR}</FormTextTitle>
              <FormText>{contact.is_lessor ? 'Kyllä' : 'Ei'}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column>
            {/* <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NOTE)}>
              <FormTextTitle>{ContactFieldTitles.NOTE}</FormTextTitle>
              <FormText>{contact.note || '-'}</FormText>
            </Authorization> */}
            {/* TODO: Wrap these fields with Authorization component when implemented to BE */}
            <FormTextTitle>{ContactFieldTitles.NOTE}</FormTextTitle>
            <FormText>{contact.note || '-'}</FormText>
          </Column>
        </Row>
      </FormWrapperRight>
    </FormWrapper>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(ContactTemplate);
