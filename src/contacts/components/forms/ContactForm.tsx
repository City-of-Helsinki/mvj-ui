import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { change, formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import Authorization from "/src/components/authorization/Authorization";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormWrapper from "/src/components/form/FormWrapper";
import FormWrapperLeft from "/src/components/form/FormWrapperLeft";
import FormWrapperRight from "/src/components/form/FormWrapperRight";
import { receiveContactFormValid } from "/src/contacts/actions";
import { FieldTypes, FormNames } from "enums";
import WarningContainer from "/src/components/content/WarningContainer";
import WarningField from "/src/components/form/WarningField";
import { getContactBusinessIdFieldError } from "/src/contacts/helpers";
import { ContactFieldPaths, ContactFieldTitles, ContactTypes } from "/src/contacts/enums";
import { getUiDataContactKey } from "uiData/helpers";
import { getFieldAttributes, isEmptyValue, isFieldAllowedToRead } from "util/helpers";
import { getAttributes, getInitialContactFormValues, getIsContactFormValid, getIsSaveClicked } from "/src/contacts/selectors";
import { getUserActiveServiceUnit } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { RootState } from "/src/root/types";
import type { UserServiceUnit } from "usersPermissions/types";
type Props = {
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  initialValues: Record<string, any>;
  isContactFormValid: boolean;
  isFocusedOnMount?: boolean;
  isSaveClicked: boolean;
  receiveContactFormValid: (...args: Array<any>) => any;
  type: string | null | undefined;
  businessId: string | null | undefined;
  userActiveServiceUnit: UserServiceUnit;
  valid: boolean;
};

class ContactForm extends Component<Props> {
  firstField: any;

  componentDidMount() {
    const {
      isFocusedOnMount,
      receiveContactFormValid,
      valid
    } = this.props;
    receiveContactFormValid(valid);

    if (isFocusedOnMount) {
      if (this.firstField) {
        this.firstField.focus();
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };

  componentDidUpdate() {
    const {
      change,
      initialValues,
      userActiveServiceUnit,
      isContactFormValid,
      receiveContactFormValid,
      valid
    } = this.props;

    if (isContactFormValid !== valid) {
      receiveContactFormValid(valid);
    }

    if (!initialValues.service_unit && userActiveServiceUnit) {
      change('service_unit', userActiveServiceUnit.id);
    }
  }

  handleAddressChange = (details: Record<string, any>) => {
    const {
      change
    } = this.props;

    if (!isEmptyValue(details.postalCode)) {
      change('postal_code', details.postalCode);
    }

    if (!isEmptyValue(details.city)) {
      change('city', details.city);
    }

    if (!isEmptyValue(details.country)) {
      change('country', details.country.toUpperCase());
    }
  };

  render() {
    const {
      attributes,
      isSaveClicked,
      type,
      businessId,
      initialValues,
      userActiveServiceUnit
    } = this.props;
    const businessIdError = getContactBusinessIdFieldError(businessId);
    if (isEmpty(attributes) || isEmpty(userActiveServiceUnit)) return null;
    return <form>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.TYPE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.TYPE)} name='type' setRefForField={this.setRefForFirstField} overrideValues={{
                  label: ContactFieldTitles.TYPE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.TYPE)} />
                </Authorization>
              </Column>
              {type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LAST_NAME)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.LAST_NAME)} name='last_name' overrideValues={{
                  label: ContactFieldTitles.LAST_NAME
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.LAST_NAME)} />
                  </Authorization>
                </Column>}
              {type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.FIRST_NAME)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.FIRST_NAME)} name='first_name' overrideValues={{
                  label: ContactFieldTitles.FIRST_NAME
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.FIRST_NAME)} />
                  </Authorization>
                </Column>}
              {type && type !== ContactTypes.PERSON && <Column small={12} medium={6} large={8}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NAME)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.NAME)} name='name' overrideValues={{
                  label: ContactFieldTitles.NAME
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.NAME)} />
                  </Authorization>
                </Column>}
            </Row>
            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CARE_OF)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.CARE_OF)} name='care_of' overrideValues={{
                  label: ContactFieldTitles.CARE_OF
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.CARE_OF)} />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ADDRESS)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.ADDRESS)} name='address' valueSelectedCallback={this.handleAddressChange} overrideValues={{
                  fieldType: FieldTypes.ADDRESS,
                  label: ContactFieldTitles.ADDRESS
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.ADDRESS)} />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={4} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.POSTAL_CODE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.POSTAL_CODE)} name='postal_code' overrideValues={{
                  label: ContactFieldTitles.POSTAL_CODE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.POSTAL_CODE)} />
                </Authorization>
              </Column>
              <Column small={12} medium={4} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.CITY)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.CITY)} name='city' overrideValues={{
                  label: ContactFieldTitles.CITY
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.CITY)} />
                </Authorization>
              </Column>
              <Column small={12} medium={4} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.COUNTRY)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.COUNTRY)} name='country' overrideValues={{
                  label: ContactFieldTitles.COUNTRY
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.COUNTRY)} />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PHONE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.PHONE)} name='phone' overrideValues={{
                  label: ContactFieldTitles.PHONE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.PHONE)} />
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={8}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.EMAIL)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.EMAIL)} name='email' overrideValues={{
                  label: ContactFieldTitles.EMAIL
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.EMAIL)} />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              {type === ContactTypes.PERSON && <Column small={23} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)} name='national_identification_number' overrideValues={{
                  label: ContactFieldTitles.NATIONAL_IDENTIFICATION_NUMBER
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.NATIONAL_IDENTIFICATION_NUMBER)} />
                  </Authorization>
                </Column>}
              {type && type !== ContactTypes.PERSON && businessIdError && businessId && <WarningContainer style={{
              position: 'absolute',
              marginTop: -50
            }}>
                <WarningField meta={{
                warning: 'Y-tunnuksen pituuden on oltava 9 merkkiä'
              }} showWarning={true} />
              </WarningContainer>}
              {type && type !== ContactTypes.PERSON && <Column small={23} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.BUSINESS_ID)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.BUSINESS_ID)} name='business_id' overrideValues={{
                  label: ContactFieldTitles.BUSINESS_ID
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.BUSINESS_ID)} />
                  </Authorization>
                </Column>}
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.LANGUAGE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.LANGUAGE)} name='language' overrideValues={{
                  label: ContactFieldTitles.LANGUAGE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.LANGUAGE)} />
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.SAP_CUSTOMER_NUMBER)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.SAP_CUSTOMER_NUMBER)} name='sap_customer_number' overrideValues={{
                  label: ContactFieldTitles.SAP_CUSTOMER_NUMBER
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.SAP_CUSTOMER_NUMBER)} />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.PARTNER_CODE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.PARTNER_CODE)} name='partner_code' overrideValues={{
                  label: ContactFieldTitles.PARTNER_CODE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.PARTNER_CODE)} />
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)} name='electronic_billing_address' overrideValues={{
                  label: ContactFieldTitles.ELECTRONIC_BILLING_ADDRESS
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.ELECTRONIC_BILLING_ADDRESS)} />
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ID)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={{ ...getFieldAttributes(attributes, ContactFieldPaths.ID),
                  read_only: true
                }} name='id' overrideValues={{
                  label: ContactFieldTitles.ID
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.ID)} />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.IS_LESSOR)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.IS_LESSOR)} name='is_lessor' overrideValues={{
                  label: ContactFieldTitles.IS_LESSOR
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.IS_LESSOR)} />
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.SERVICE_UNIT)}>
                  <FormTextTitle uiDataKey={getUiDataContactKey(ContactFieldPaths.SERVICE_UNIT)}>
                    {ContactFieldTitles.SERVICE_UNIT}
                  </FormTextTitle>
                  <FormText>
                    {initialValues.service_unit ? initialValues.service_unit.name || '-' : userActiveServiceUnit && userActiveServiceUnit.name || '-'}
                  </FormText>
                </Authorization>
              </Column>
              {type === ContactTypes.PERSON && <Column small={12} medium={6} large={4}>
                  <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.ADDRESS_PROTECTION)}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.ADDRESS_PROTECTION)} name='address_protection' overrideValues={{
                  label: ContactFieldTitles.ADDRESS_PROTECTION
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.ADDRESS_PROTECTION)} />
                  </Authorization>
                </Column>}
            </Row>
            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, ContactFieldPaths.NOTE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, ContactFieldPaths.NOTE)} name='note' overrideValues={{
                  fieldType: FieldTypes.TEXTAREA,
                  label: ContactFieldTitles.NOTE
                }} enableUiDataEdit uiDataKey={getUiDataContactKey(ContactFieldPaths.NOTE)} />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>
      </form>;
  }

}

const formName = FormNames.CONTACT;
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    isContactFormValid: getIsContactFormValid(state),
    initialValues: getInitialContactFormValues(state),
    isSaveClicked: getIsSaveClicked(state),
    type: selector(state, 'type'),
    businessId: selector(state, 'business_id'),
    userActiveServiceUnit: getUserActiveServiceUnit(state)
  };
};

export default flowRight(connect(mapStateToProps, {
  change,
  receiveContactFormValid
}), reduxForm({
  destroyOnUnmount: false,
  enableReinitialize: true,
  form: formName
}))(ContactForm) as React.ComponentType<any>;