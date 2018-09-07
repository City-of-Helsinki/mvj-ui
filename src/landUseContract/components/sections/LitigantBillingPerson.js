// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isLitigantActive} from '$src/landUseContract/helpers';
import {formatDate, formatDateRange} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
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
      header={
        <div>
          <Column></Column>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Välillä:</label>
              {formatDateRange(get(billingPerson, 'start_date'), get(billingPerson, 'end_date')) || '-'}
            </span>
          </Column>
        </div>
      }

      headerTitle={<h4 className='collapse__header-title'>Laskunsaaja</h4>}
      onToggle={handleCollapseToggle}
    >
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12}>
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
              <Row>
                <Column>
                  <label>Alkupvm</label>
                  <p>{formatDate(get(billingPerson, 'start_date')) || '-'}</p>
                </Column>
                <Column>
                  <label>Loppupvm</label>
                  <p>{formatDate(get(billingPerson, 'end_date')) || '-'}</p>
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>
      <ContactTemplate
        contact={contact}
      />
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
