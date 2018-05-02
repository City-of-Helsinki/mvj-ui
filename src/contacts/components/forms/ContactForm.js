// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {receiveContactFormValid} from '$src/contacts/actions';
import {ContactType} from '$src/contacts/enums';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getInitialContactFormValues, getIsContactFormValid} from '$src/contacts/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/contacts/types';
import type {RootState} from '$src/root/types';

type Props = {
  attributes: Attributes,
  initialValues: Object,
  isContactFormValid: boolean,
  handleSubmit: Function,
  receiveContactFormValid: Function,
  type: ?string,
  valid: boolean,
}

class ContactForm extends Component {
  props: Props

  componentDidMount() {
    const {receiveContactFormValid, valid} = this.props;
    receiveContactFormValid(valid);
  }

  componentDidUpdate() {
    const {isContactFormValid, receiveContactFormValid, valid} = this.props;
    if(isContactFormValid !== valid) {
      receiveContactFormValid(valid);
    }
  }

  render() {
    const {attributes, handleSubmit, type} = this.props;
    const typeOptions = getAttributeFieldOptions(attributes, 'type');
    const languageOptions = getAttributeFieldOptions(attributes, 'language');
    if (isEmpty(attributes)) {
      return null;
    }

    return(
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FormWrapper>
            <FormWrapperLeft>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label='Asiakastyyppi'
                    name='type'
                    options={typeOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'type')),
                    ]}
                  />
                </Column>
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Sukunimi'
                      name='last_name'
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'last_name')),
                      ]}
                    />
                  </Column>
                }
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Etunimi'
                      name='first_name'
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'first_name')),
                      ]}
                    />
                  </Column>
                }
                {type && type !== ContactType.PERSON &&
                  <Column small={12} medium={6} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Yrityksen nimi'
                      name='name'
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'business_name')),
                      ]}
                    />
                  </Column>
                }
              </Row>
              <Row>
                <Column>
                  <Field
                    component={FieldTypeText}
                    label='Katuosoite'
                    name='address'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'address')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={4} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Postinumero'
                    name='postal_code'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'postal_code')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={4} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Postitoimipaikka'
                    name='city'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'city')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={4} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Maa'
                    name='country'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'country')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Puhelinnumero'
                    name='phone'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'phone')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <Field
                    component={FieldTypeText}
                    label='Sähköposti'
                    name='email'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'email')),
                    ]}
                  />
                </Column>
              </Row>
            </FormWrapperLeft>
            <FormWrapperRight>
              <Row>
                {type === ContactType.PERSON &&
                  <Column small={23} medium={6} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Henkilötunnus'
                      name='national_identification_number'
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'national_identification_number')),
                      ]}
                    />
                  </Column>
                }
                {type && type !== ContactType.PERSON &&
                  <Column small={23} medium={6} large={4}>
                    <Field
                      component={FieldTypeText}
                      label='Y-tunnus'
                      name='business_id'
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'business_id')),
                      ]}
                    />
                  </Column>
                }
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeSelect}
                    label='Kieli'
                    name='language'
                    options={languageOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'language')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='SAP asiakasnumero'
                    name='sap_customer_number'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'sap_customer_number')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Kumppanikoodi'
                    name='partner_code'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'partner_code')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Ovt tunnus'
                    name='electronic_billing_address'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'electronic_billing_address')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Asiakasnumero'
                    name='customer_number'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'customer_number')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Field
                    className='checkbox-inline'
                    component={FieldTypeCheckbox}
                    label='Vuokranantaja'
                    name="is_lessor"
                    options= {[
                      {value: 'true', label: 'Vuokranantaja'},
                    ]}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'is_lessor')),
                    ]}
                  />
                </Column>
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={6}>
                    <Field
                      className='checkbox-inline'
                      component={FieldTypeCheckbox}
                      label='Turvakielto'
                      name="address_protection"
                      options= {[
                        {value: 'true', label: 'Turvakielto'},
                      ]}
                      validate={[
                        (value) => genericValidator(value, get(attributes, 'address_protection')),
                      ]}
                    />
                  </Column>
                }
              </Row>
              <Row>
                <Column>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name='note'
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'note')),
                    ]}
                  />
                </Column>
              </Row>
            </FormWrapperRight>
          </FormWrapper>
        </FormSection>
      </form>
    );
  }
}

const formName = 'contact-form';
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    isContactFormValid: getIsContactFormValid(state),
    initialValues: getInitialContactFormValues(state),
    type: selector(state, 'type'),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      receiveContactFormValid,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(ContactForm);
