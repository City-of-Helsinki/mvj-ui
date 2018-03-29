// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

import type {Attributes as ContactAttributes} from '$src/contacts/types';

type Props = {
  contact: Object,
  contactAttributes: ContactAttributes,
  tenant: Object,
};

const TenantItem = ({
  contact,
  contactAttributes,
  tenant,
}: Props) => {
  const getFullName = () => {
    return contact.is_business ? contact.business_name : `${contact.last_name} ${contact.first_name}`;
  };

  const getInvoiceManagementShare = () => {
    if(!tenant ||
      !tenant.share_numerator ||
      !isNumber(Number(tenant.share_numerator)) ||
      !tenant.share_denominator ||
      !isNumber(Number(tenant.share_denominator))) {
      return null;
    }
    return `${(Number(tenant.share_numerator)*100/Number(tenant.share_denominator)).toFixed(1)} %`;
  };

  const languageOptions = getAttributeFieldOptions(contactAttributes, 'language');

  if(!contact) {
    return null;
  }
  console.log(tenant);
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={4}>
          <label>Asiakas</label>
          <p>{getFullName()}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Osuus murtolukuna</label>
          <p>{tenant.share_numerator || ''} / {tenant.share_denominator || ''}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Laskun hallintaosuus</label>
          <p>{getInvoiceManagementShare()}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Alkupäivämäärä</label>
          <p>{formatDate(get(tenant, 'tenant.start_date')) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Loppupäivämäärä</label>
          <p>{formatDate(get(tenant, 'tenant.end_date')) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Viite</label>
          <p>{tenant.reference || '-'}</p>
        </Column>
        <Column small={6} medium={8} large={2}>
          <label>Kommentti</label>
          <p>{tenant.note || '-'}</p>
        </Column>
      </Row>
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
          {contact.address_protection
            ? <p className='alert'><i/><span>Turvakielto</span></p>
            : <p>Ei turvakieltoa</p>
          }
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
          <p className='no-margin'>{contact.is_lessor ? 'Kyllä' : 'Ei'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default TenantItem;
