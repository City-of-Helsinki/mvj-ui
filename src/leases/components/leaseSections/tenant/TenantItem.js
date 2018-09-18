// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getRouteById} from '$src/root/routes';

type Props = {
  contact: ?Object,
  tenant: Object,
};

const TenantItem = ({
  contact,
  tenant,
}: Props) => {
  const getInvoiceManagementShare = () => {
    if(!Number(get(tenant, 'share_numerator')) || !Number(get(tenant, 'share_denominator'))) {
      return null;
    }
    return (Number(tenant.share_numerator)*100/Number(tenant.share_denominator));
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
            <Column small={12}>
              <FormTitleAndText
                title='Asiakas'
                text={contact
                  ? <ExternalLink
                    href={`${getRouteById('contacts')}/${contact.id}`}
                    text={getContactFullName(contact)}
                  />
                  : '-'
                }
              />
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Osuus murtolukuna'
                text={`${get(tenant, 'share_numerator', '')} / ${get(tenant, 'share_denominator', '')}`}
              />
            </Column>
            <Column small={12} medium={6} large={4}>
              <FormTitleAndText
                title='Laskun hallintaosuus'
                text={share ? `${formatNumber(share)} %` : '-'}
              />
            </Column>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <FormTitleAndText
                    title='Alkupvm'
                    text={formatDate(get(tenant, 'tenant.start_date'))}
                  />
                </Column>
                <Column>
                  <FormTitleAndText
                    title='Loppupvm'
                    text={formatDate(get(tenant, 'tenant.end_date'))}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>

      <ContactTemplate contact={contact} />

      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column>
              <FormTitleAndText
                title='Viite'
                text={tenant.reference || '-'}
              />
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>
    </div>
  );
};

export default TenantItem;
