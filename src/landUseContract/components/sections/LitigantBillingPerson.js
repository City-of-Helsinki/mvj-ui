// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isLitigantActive} from '$src/landUseContract/helpers';
import {formatDate, formatDateRange} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';

type Props = {
  billingPerson: Object,
  collapseState: boolean,
  receiveCollapseStates: Function,
};

const LitigantBillingPerson = ({
  billingPerson,
  collapseState,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LITIGANTS]: {
          billing_persons: {
            [billingPerson.id]: val,
          },
        },
      },
    });
  };

  const contact = get(billingPerson, 'contact');
  const isActive = isLitigantActive(billingPerson);
  const collapseDefault = collapseState !== undefined ? collapseState : isActive;

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={collapseDefault}
      headerSubtitle={
        <Fragment>
          <Column></Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(get(billingPerson, 'start_date'), get(billingPerson, 'end_date')) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>
      }

      headerTitle={<CollapseHeaderTitle>Laskunsaaja</CollapseHeaderTitle>}
      onToggle={handleCollapseToggle}
    >
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12}>
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
              <Row>
                <Column>
                  <FormTitleAndText
                    title='Alkupvm'
                    text={formatDate(get(billingPerson, 'start_date')) || '-'}
                  />
                </Column>
                <Column>
                  <FormTitleAndText
                    title='Loppupvm'
                    text={formatDate(get(billingPerson, 'end_date')) || '-'}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>

      <SubTitle>Asiakkaan tiedot</SubTitle>
      <ContactTemplate contact={contact} />
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.billingPerson.id;
    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LITIGANTS}.billing_persons.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(LitigantBillingPerson);
