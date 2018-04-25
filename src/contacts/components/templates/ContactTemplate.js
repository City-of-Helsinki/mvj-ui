// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

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
            <label>Asiakastyyppi</label>
            <p>{getLabelOfOption(typeOptions, contact.type) || '-'}</p>
          </Column>
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <label>Sukunimi</label>
              <p>{contact.last_name || '-'}</p>
            </Column>
          }
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <label>Etunimi</label>
              <p>{contact.first_name || '-'}</p>
            </Column>
          }
          {contact.type && contact.type !== ContactType.PERSON &&
            <Column small={12} medium={6} large={8}>
              <label>Yrityksen nimi</label>
              <p>{contact.name || '-'}</p>
            </Column>
          }
        </Row>
        <Row>
          <Column>
            <label>Katuosoite</label>
            <p>{contact.address || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={4} large={4}>
            <label>Postinumero</label>
            <p>{contact.postal_code || '-'}</p>
          </Column>
          <Column small={12} medium={4} large={4}>
            <label>Postitoimipaikka</label>
            <p>{contact.city || '-'}</p>
          </Column>
          <Column small={12} medium={4} large={4}>
            <label>Maa</label>
            <p>{contact.country || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <label>Puhelinnumero</label>
            <p>{contact.phone || '-'}</p>
          </Column>
          <Column small={12} medium={6} large={8}>
            <label>Sähköposti</label>
            <p>{contact.email || '-'}</p>
          </Column>
        </Row>
      </FormWrapperLeft>
      <FormWrapperRight>
        <Row>
          {contact.type === ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <label>Henkilötunnus</label>
              <p>{contact.national_identification_number || '-'}</p>
            </Column>
          }

          {contact.type && contact.type !== ContactType.PERSON &&
            <Column small={12} medium={6} large={4}>
              <label>Y-tunnus</label>
              <p>{contact.business_id || '-'}</p>
            </Column>
          }
          <Column small={12} medium={6} large={4}>
            <label>Kieli</label>
            <p>{getLabelOfOption(languageOptions, contact.language) || '-'}</p>
          </Column>
          <Column small={12} medium={6} large={4}>
            <label>SAP asiakasnumero</label>
            <p>{contact.sap_customer_number || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <label>Kumppanikoodi</label>
            <p>{contact.partner_code || '-'}</p>
          </Column>
          <Column small={12} medium={6} large={4}>
            <label>Ovt-tunnus</label>
            <p>{contact.electronic_billing_address || '-'}</p>
          </Column>
          <Column small={12} medium={6} large={4}>
            <label>Asiakasnumero</label>
            <p>{contact.customer_number || '-'}</p>
          </Column>

        </Row>
        <Row>
          <Column small={12} medium={6} large={4}>
            <label>Turvakielto</label>
            {contact.address_protection
              ? <p className='alert'><i/><span>Turvakielto</span></p>
              : <p>Ei turvakieltoa</p>
            }
          </Column>
          <Column small={12} medium={6} large={4}>
            <label>Vuokranantaja</label>
            <p>{contact.is_lessor ? 'Kyllä' : 'Ei'}</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <label>Kommentti</label>
            <p>{contact.note || '-'}</p>
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
