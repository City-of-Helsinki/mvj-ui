// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {receiveContactFormValid} from '$src/contacts/actions';
import {ContactType, FormNames} from '$src/contacts/enums';
import {getAttributes, getInitialContactFormValues, getIsContactFormValid} from '$src/contacts/selectors';

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

class ContactForm extends Component<Props> {
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
                  <FormField
                    fieldAttributes={get(attributes, 'type')}
                    name='type'
                    overrideValues={{
                      label: 'Asiakastyyppi',
                    }}
                  />
                </Column>
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={4}>
                    <FormField
                      fieldAttributes={get(attributes, 'last_name')}
                      name='last_name'
                      overrideValues={{
                        label: 'Sukunimi',
                      }}
                    />
                  </Column>
                }
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={4}>
                    <FormField
                      fieldAttributes={get(attributes, 'first_name')}
                      name='first_name'
                      overrideValues={{
                        label: 'Etunimi',
                      }}
                    />
                  </Column>
                }
                {type && type !== ContactType.PERSON &&
                  <Column small={12} medium={6} large={8}>
                    <FormField
                      fieldAttributes={get(attributes, 'name')}
                      name='name'
                      overrideValues={{
                        label: 'Yrityksen nimi',
                      }}
                    />
                  </Column>
                }
              </Row>
              <Row>
                <Column>
                  <FormField
                    fieldAttributes={get(attributes, 'address')}
                    name='address'
                    overrideValues={{
                      label: 'Katuosoite',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={4} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'postal_code')}
                    name='postal_code'
                    overrideValues={{
                      label: 'Postinumero',
                    }}
                  />
                </Column>
                <Column small={12} medium={4} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'city')}
                    name='city'
                    overrideValues={{
                      label: 'Postitoimipaikka',
                    }}
                  />
                </Column>
                <Column small={12} medium={4} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'country')}
                    name='country'
                    overrideValues={{
                      label: 'Maa',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'phone')}
                    name='phone'
                    overrideValues={{
                      label: 'Puhelinnumero',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormField
                    fieldAttributes={get(attributes, 'email')}
                    name='email'
                    overrideValues={{
                      label: 'Sähköposti',
                    }}
                  />
                </Column>
              </Row>
            </FormWrapperLeft>
            <FormWrapperRight>
              <Row>
                {type === ContactType.PERSON &&
                  <Column small={23} medium={6} large={4}>
                    <FormField
                      fieldAttributes={get(attributes, 'national_identification_number')}
                      name='national_identification_number'
                      overrideValues={{
                        label: 'Henkilötunnus',
                      }}
                    />
                  </Column>
                }
                {type && type !== ContactType.PERSON &&
                  <Column small={23} medium={6} large={4}>
                    <FormField
                      fieldAttributes={get(attributes, 'business_id')}
                      name='business_id'
                      overrideValues={{
                        label: 'Y-tunnus',
                      }}
                    />
                  </Column>
                }
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'language')}
                    name='language'
                    overrideValues={{
                      label: 'Kieli',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'sap_customer_number')}
                    name='sap_customer_number'
                    overrideValues={{
                      label: 'SAP asiakasnumero',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'partner_code')}
                    name='partner_code'
                    overrideValues={{
                      label: 'Kumppanikoodi',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'electronic_billing_address')}
                    name='electronic_billing_address'
                    overrideValues={{
                      label: 'Ovt tunnus',
                    }}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'customer_number')}
                    name='customer_number'
                    overrideValues={{
                      label: 'Asiakasnumero',
                    }}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormField
                    fieldAttributes={get(attributes, 'is_lessor')}
                    name='is_lessor'
                    overrideValues={{
                      label: 'Vuokranantaja',
                    }}
                  />
                </Column>
                {type === ContactType.PERSON &&
                  <Column small={12} medium={6} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'address_protection')}
                      name='address_protection'
                      overrideValues={{
                        label: 'Turvakielto',
                      }}
                    />
                  </Column>
                }
              </Row>
              <Row>
                <Column>
                  <FormField
                    fieldAttributes={get(attributes, 'note')}
                    name='note'
                    overrideValues={{
                      label: 'Huomautus',
                    }}
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

const formName = FormNames.CONTACT;
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
    destroyOnUnmount: false,
    form: formName,
    enableReinitialize: true,
  }),
)(ContactForm);
