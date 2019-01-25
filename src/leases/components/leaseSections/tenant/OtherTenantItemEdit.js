// @flow
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
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
import {FieldTypes} from '$components/enums';
import {
  FormNames,
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
  TenantContactType,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  formatDateRange,
  hasPermissions,
  isFieldAllowedToRead,
} from '$util/helpers';
import {isTenantActive, isTenantArchived} from '$src/leases/helpers';
import {getMethods as getContactMethods} from '$src/contacts/selectors';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, Methods} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const ContactType = PropTypes.oneOf([TenantContactType.BILLING, TenantContactType.CONTACT]);

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contactMethods: Methods,
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
  usersPermissions: UsersPermissionsType,
}

const OtherTenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  contactMethods,
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
  usersPermissions,
}: Props) => {
  const getOtherTenantById = (id: number) => {
    const tenantContactSet = contactType === TenantContactType.BILLING
      ? get(tenant, 'billing_persons', [])
      : get(tenant, 'contact_persons', []);

    return id ? tenantContactSet.find((tenant) => tenant.id === id) : null;
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
    if(!tenantId) return;

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

  const savedTenant = getOtherTenantById(tenantId),
    active = isTenantActive(savedTenant),
    archived = isTenantArchived(savedTenant),
    tenantErrors = get(errors, field);

  return (
    <Collapse
      archived={archived}
      className={classNames('collapse__secondary')}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerSubtitles={
        <Fragment>
          <Column></Column>
          <Column>
            {savedTenant &&
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE) && isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                <CollapseHeaderSubtitle>
                  <span>Välillä:</span>
                  {formatDateRange(savedTenant.start_date, savedTenant.end_date) || '-'}
                </CollapseHeaderSubtitle>
              </Authorization>
            }
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TYPE)}>
          {contactType === TenantContactType.BILLING ? 'Laskunsaaja' : 'Yhteyshenkilö'}
        </Authorization>
      }
      onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANTCONTACT) ? onRemove : null}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12}>
                <Row>
                  <Column small={9} medium={8}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}
                        name={`${field}.contact`}
                        overrideValues={{
                          fieldType: FieldTypes.CONTACT,
                          label: LeaseTenantContactSetFieldTitles.CONTACT,
                        }}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} medium={4}>
                    <Authorization allow={contactMethods.POST}>
                      <div className='contact-buttons-wrapper'>
                        <AddButtonThird
                          label='Luo asiakas'
                          onClick={handleAddClick}
                        />
                      </div>
                    </Authorization>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>

          <FormWrapperRight>
            <Row>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}
                    name={`${field}.start_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.START_DATE}}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}
                    name={`${field}.end_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.END_DATE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {!!contact &&
            <SubTitle>Asiakkaan tiedot
              <Authorization allow={contactMethods.PATCH}>
                <EditButton
                  className='inline-button'
                  onClick={handleEditClick}
                  title='Muokkaa asiakasta'
                />
              </Authorization>
            </SubTitle>
          }
          <ContactTemplate contact={contact} />
        </Authorization>
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
      contactMethods: getContactMethods(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      tenantId: id,
      usersPermissions: getUsersPermissions(state),
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
