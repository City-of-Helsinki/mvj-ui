// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import ContentContainer from '$components/content/ContentContainer';
import GreenBox from '$components/content/GreenBox';

import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  contact: Contact,
}

const ContactReadonly = ({attributes, contact}: Props) => {
  const languageOptions = getAttributeFieldOptions(attributes, 'language');
  return (
    <ContentContainer>
      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={2}>
            <label>Yritys</label>
            <p>{contact.is_business ? 'Kyllä' : 'Ei'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Etunimi</label>
            <p>{contact.first_name || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Sukunimi</label>
            <p>{contact.last_name || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Henkilötunnus</label>
            <p>{contact.national_identification_number || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Y-tunnus</label>
            <p>{contact.business_id || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Yrityksen nimi</label>
            <p>{contact.business_name || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={8} large={4}>
            <label>Katuosoite</label>
            <p>{contact.address || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Postinumero</label>
            <p>{contact.postal_code || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Kaupunki</label>
            <p>{contact.city || '-'}</p>
          </Column>
          <Column small={12} medium={8} large={4}>
            <label>Sähköposti</label>
            <p>{contact.email || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <label>Puhelinnumero</label>
            <p>{contact.phone || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Asiakasnumero</label>
            <p>{contact.customer_number || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Kieli</label>
            <p>{getLabelOfOption(languageOptions, contact.language) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Turvakielto</label>
            <p>{contact.address_protection ? 'Kyllä' : 'Ei'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>SAP asiakasnumero</label>
            <p>{contact.sap_customer_number || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Ovt-tunnus</label>
            <p>{contact.electronic_billing_address || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <label>Kumppanikoodi</label>
            <p className='no-margin'>{contact.partner_code || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Vuokranantaja</label>
            <p className='no-margin'>{contact.lessor ? 'Kyllä' : 'Ei'}</p>
          </Column>
        </Row>
      </GreenBox>
    </ContentContainer>
  );
};

export default ContactReadonly;
