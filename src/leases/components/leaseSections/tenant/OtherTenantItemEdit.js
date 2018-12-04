// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import FormField from '$components/form/FormField';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, TenantContactType} from '$src/leases/enums';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

const ContactType = PropTypes.oneOf([TenantContactType.BILLING, TenantContactType.CONTACT]);

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contactType: ContactType,
  contact: ?Object,
  errors: ?Object,
  field: string,
  index: number,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenant: Object,
  tenantId: number,
}

const OtherTenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  contactType,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenant,
  tenantId,
}: Props) => {
  const getOtherTenantById = (id: number) => {
    const tenantContactSet = contactType === TenantContactType.BILLING
      ? get(tenant, 'billing_persons', [])
      : get(tenant, 'contact_persons', []);

    if(!id) {
      return null;
    }

    return tenantContactSet.find((tenant) => tenant.id === id);
  };

  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.contact`,
      contactId: null,
      isNew: true,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleAddKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleAddClick();
    }
  };

  const handleEditClick = () => {
    initializeContactForm({...contact});
    receiveContactModalSettings({
      field: `${field}.contact`,
      contactId: null,
      isNew: false,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleCollapseToggle = (val: boolean) => {
    if(!tenantId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.TENANTS]: {
          others: {
            [tenantId]: val,
          },
        },
      },
    });
  };

  const savedOtherTenant = getOtherTenantById(tenantId),
    isActive = isTenantActive(savedOtherTenant),
    tenantErrors = get(errors, field);

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={<h4 className='collapse__header-title edit-row'>{contactType === TenantContactType.BILLING ? 'Laskunsaaja' : 'Yhteyshenkilö'}</h4>}
      onRemove={onRemove}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12} medium={12} large={8}>
                <Row>
                  <Column small={9} medium={8} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.contact')}
                      name={`${field}.contact`}
                      overrideValues={{
                        fieldType: 'contact',
                        label: 'Asiakas',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={4} large={4}>
                    <div className='contact-buttons-wrapper'>
                      <a onKeyDown={handleAddKeyDown} onClick={handleAddClick} tabIndex={0}>Luo asiakas</a>
                    </div>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.start_date')}
                  name={`${field}.start_date`}
                  overrideValues={{
                    label: 'Alkupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.end_date')}
                  name={`${field}.end_date`}
                  overrideValues={{
                    label: 'Loppupvm',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        {!!contact &&
          <SubTitle>Asiakkaan tiedot
            <EditButton
              className='inline-button'
              onClick={handleEditClick}
              title='Muokkaa asiakasta'
            />
          </SubTitle>
        }
        <ContactTemplate contact={contact} />
      </BoxContentWrapper>
    </Collapse>
  );
};

const formName = FormNames.TENANTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.TENANTS}.others.${id}`),
      contact: selector(state, `${props.field}.contact`),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      tenantId: id,
    };
  },
  {
    initializeContactForm,
    receiveCollapseStates,
    receiveContactModalSettings,
    receiveIsSaveClicked,
    showContactModal,
  }
)(OtherTenantItemEdit);
