// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormTitleAndText from '$components/form/FormTitleAndText';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/contacts/selectors';
import {ContactType} from '$src/contacts/enums';

import type {Attributes} from '$src/contacts/types';

type Props = {
  contact: ?Object,
  attributes: Attributes,
}

const ContactTemplate = ({contact, attributes}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'type');
  const languageOptions = getAttributeFieldOptions(attributes, 'language');
  if(!contact) {
    return null;
  }
  return (
    <FormWrapper>
      <FormWrapperLeft>
        <Row>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Asiakastyyppi'
              text={getLabelOfOption(typeOptions, contact.type) || '-'}
            />
          </Column>
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Sukunimi'
                text={contact.last_name || '-'}
              />
            </Column>
          }
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Etunimi'
                text={contact.first_name || '-'}
              />
            </Column>
          }
          {contact.type && contact.type !== ContactType.PERSON &&
            <Column small={12} medium={6} large={8}>
              <FormTitleAndText
                title='Yrityksen nimi'
                text={contact.name || '-'}
              />
            </Column>
          }
        </Row>
        <Row>
          <Column>
            <FormTitleAndText
              title='Katuosoite'
              text={contact.address || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={4} large={4}>
            <FormTitleAndText
              title='Postinumero'
              text={contact.postal_code || '-'}
            />
          </Column>
          <Column small={12} medium={4} large={4}>
            <FormTitleAndText
              title='Postitoimipaikka'
              text={contact.city || '-'}
            />
          </Column>
          <Column small={12} medium={4} large={4}>
            <FormTitleAndText
              title='Maa'
              text={contact.country || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Puhelinnumero'
              text={contact.phone || '-'}
            />
          </Column>
          <Column small={12} medium={6} large={8}>
            <FormTitleAndText
              title='Sähköposti'
              text={contact.email || '-'}
            />
          </Column>
        </Row>
      </FormWrapperLeft>
      <FormWrapperRight>
        <Row>
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Henkilötunnus'
                text={contact.national_identification_number || '-'}
              />
            </Column>
          }
          {contact.type && contact.type !== ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Y-tunnus'
                text={contact.business_id || '-'}
              />
            </Column>
          }
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Kieli'
              text={getLabelOfOption(languageOptions, contact.language) || '-'}
            />
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='SAP asiakasnumero'
              text={contact.sap_customer_number || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Kumppanikoodi'
              text={contact.partner_code || '-'}
            />
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Ovt-tunnus'
              text={contact.electronic_billing_address || '-'}
            />
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Asiakasnumero'
              text={contact.customer_number || '-'}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Turvakielto'
              text={contact.address_protection
                ? <span><i/><span>Turvakielto</span></span>
                : 'Ei turvakieltoa'
              }
              textClassName={contact.address_protection ? 'alert' : ''}
            />
          </Column>
          <Column small={12} medium={6} large={4}>
            <FormTitleAndText
              title='Vuokranantaja'
              text={contact.is_lessor ? 'Kyllä' : 'Ei'}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FormTitleAndText
              title='Huomautus'
              text={contact.note || '-'}
            />
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
