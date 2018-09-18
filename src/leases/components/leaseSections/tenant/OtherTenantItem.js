// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import ExternalLink from '$components/links/ExternalLink';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {formatDate, formatDateRange, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  receiveCollapseStates: Function,
  tenant: Object,
};

const OtherTenantItem = ({
  attributes,
  collapseState,
  receiveCollapseStates,
  tenant,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.TENANTS]: {
          others: {
            [tenant.id]: val,
          },
        },
      },
    });
  };

  const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type');
  const contact = get(tenant, 'contact');
  const isActive = isTenantActive(tenant);
  const collapseDefault = collapseState !== undefined ? collapseState : isActive;

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={collapseDefault}
      header={
        <div>
          <Column></Column>
          <Column>
            <p className={'collapse__header-subtitle'}>
              <span>Välillä:</span>
              {formatDateRange(get(tenant, 'start_date'), get(tenant, 'end_date')) || '-'}
            </p>
          </Column>
        </div>
      }

      headerTitle={<h4 className='collapse__header-title'>{getLabelOfOption(tenantTypeOptions, tenant.type)}</h4>}
      onToggle={handleCollapseToggle}
    >
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12} medium={6} large={8}>
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
                title='Rooli'
                text={getLabelOfOption(tenantTypeOptions, tenant.type) || '-'}
              />
            </Column>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <FormTitleAndText
                    title='Alkupvm'
                    text={formatDate(get(tenant, 'start_date')) || '-'}
                  />
                </Column>
                <Column>
                  <FormTitleAndText
                    title='Loppupvm'
                    text={formatDate(get(tenant, 'end_date')) || '-'}
                  />
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
    const id = props.tenant.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.TENANTS}.others.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(OtherTenantItem);
