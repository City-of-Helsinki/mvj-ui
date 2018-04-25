// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import isNumber from 'lodash/isNumber';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import {getContactFullName} from '$src/contacts/helpers';

type Props = {
  contact: ?Object,
  tenant: Object,
};

const TenantItem = ({
  contact,
  tenant,
}: Props) => {
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

  if(!contact) {
    return null;
  }

  return (
    <div>
      <Row>
        <Column small={12} medium={6} large={4}>
          <label>Asiakas</label>
          <p>{getContactFullName(contact)}</p>
        </Column>
        <Column small={12} medium={6} large={2}>
          <label>Laskun hallintaosuus</label>
          <p>{getInvoiceManagementShare()}</p>
        </Column>
      </Row>
      <ContactTemplate
        contact={contact}
      />
      <Row>
        <Column small={6} medium={4} large={4}>
          <label>Viite</label>
          <p>{tenant.reference || '-'}</p>
        </Column>
        <Column small={6} medium={8} large={8}>
          <label>Kommentti</label>
          <p>{tenant.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default TenantItem;
