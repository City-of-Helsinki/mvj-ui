// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';

type Props = {
  contact: ?Object,
  litigant: Object,
};

const LitigantItem = ({
  contact,
  litigant,
}: Props) => {
  const getInvoiceManagementShare = () => {
    if(!Number(litigant.share_numerator) || !Number(litigant.share_denominator)) {
      return 0;
    }
    return (Number(litigant.share_numerator)*100/Number(litigant.share_denominator));
  };

  if(!contact) {
    return null;
  }

  const share = getInvoiceManagementShare();
  return (
    <Fragment>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
              <FormTitleAndText
                title='Asiakas'
                text={contact
                  ? <ExternalLink
                    className='no-margin'
                    href={`${getRouteById(Routes.CONTACTS)}/${contact.id}`}
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
                text={`${get(litigant, 'share_numerator', '')} / ${get(litigant, 'share_denominator', '')}`}
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
                    text={formatDate(get(litigant, 'litigant.start_date'))}
                  />
                </Column>
                <Column>
                  <FormTitleAndText
                    title='Loppupvm'
                    text={formatDate(get(litigant, 'litigant.end_date'))}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>

        <FormWrapperLeft>
          <Row>
            <Column>
              <FormTitleAndText
                title='Viite'
                text={litigant.reference || '-'}
              />
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>

      <SubTitle>Asiakkaan tiedot</SubTitle>
      <ContactTemplate contact={contact} />
    </Fragment>
  );
};

export default LitigantItem;
