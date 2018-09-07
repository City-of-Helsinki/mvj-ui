// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getRouteById} from '$src/root/routes';

type Props = {
  contact: ?Object,
  litigant: Object,
};

const LitigantItem = ({
  contact,
  litigant,
}: Props) => {
  const getInvoiceManagementShare = () => {
    if(!Number(get(litigant, 'share_numerator')) || !Number(get(litigant, 'share_denominator'))) {
      return 0;
    }
    return (Number(litigant.share_numerator)*100/Number(litigant.share_denominator));
  };

  if(!contact) {
    return null;
  }

  const share = getInvoiceManagementShare();
  return (
    <div>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
              <label>Asiakas</label>
              {contact
                ? <p><ExternalLink
                  href={`${getRouteById('contacts')}/${contact.id}`}
                  label={getContactFullName(contact)}
                /></p>
                : <p>-</p>
              }
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <label>Osuus murtolukuna:</label>
              <p>{get(litigant, 'share_numerator', '')} / {get(litigant, 'share_denominator', '')}</p>
            </Column>
            <Column small={12} medium={6} large={4}>
              <label>Laskun hallintaosuus</label>
              <p>{share ? `${formatNumber(share)} %` : '-'}</p>
            </Column>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <label>Alkupvm</label>
                  <p>{formatDate(get(litigant, 'litigant.start_date'))}</p>
                </Column>
                <Column>
                  <label>Loppupvm</label>
                  <p>{formatDate(get(litigant, 'litigant.end_date'))}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>
      <ContactTemplate
        contact={contact}
      />
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column>
              <label>Viite</label>
              <p>{litigant.reference || '-'}</p>
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>
    </div>
  );
};

export default LitigantItem;
