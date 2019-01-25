// @flow
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import OtherTenantItemEdit from './OtherTenantItemEdit';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
  TenantContactType,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  formatDateRange,
  formatNumber,
  getFieldAttributes,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive, isTenantArchived} from '$src/leases/helpers';
import {getMethods as getContactMethods} from '$src/contacts/selectors';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, Methods} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const ContactType = PropTypes.oneOf([TenantContactType.BILLING, TenantContactType.CONTACT]);

type OtherTenantsProps = {
  contactType: ContactType,
  fields: any,
  showAddButton: boolean,
  tenant: Object,
  usersPermissions: UsersPermissionsType,
}

const renderOtherTenants = ({
  contactType,
  fields,
  showAddButton,
  tenant,
  usersPermissions,
}: OtherTenantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.OTHER_TENANT,
                  confirmationModalTitle: DeleteModalTitles.OTHER_TENANT,
                });
              };

              return (
                <OtherTenantItemEdit
                  key={index}
                  contactType={contactType}
                  field={field}
                  onRemove={handleRemove}
                  tenant={tenant}
                />
              );
            })}
            {showAddButton &&
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TENANTCONTACT)}>
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className='no-top-margin'
                      label={(contactType === TenantContactType.BILLING) ? 'Lisää laskunsaaja' : 'Lisää yhteyshenkilö'}
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contact: ?Object,
  contactMethods: Methods,
  errors: ?Object,
  field: string,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  shareDenominator: ?string,
  shareNumerator: ?string,
  showContactModal: Function,
  tenantId: number,
  tenants: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const TenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  contactMethods,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  shareDenominator,
  shareNumerator,
  showContactModal,
  tenantId,
  tenants,
  usersPermissions,
}: Props) => {
  const getTenantById = (id: number) => {
    return id ? tenants.find((tenant) => tenant.id === id) : {};
  };

  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
      contactId: null,
      isNew: true,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleEditClick = () => {
    initializeContactForm({...contact});
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
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
          tenants: {
            [tenantId]: val,
          },
        },
      },
    });
  };

  const getInvoiceManagementShare = () => {
    if(!Number(shareNumerator) || !Number(shareDenominator)) return null;

    return (Number(shareNumerator)*100/Number(shareDenominator));
  };

  const share = getInvoiceManagementShare();
  const savedTenant = getTenantById(tenantId);
  const active = isTenantActive(savedTenant && savedTenant.tenant);
  const archived = isTenantArchived(savedTenant && savedTenant.tenant);
  const tenantErrors = get(errors, field);

  return (
    <Collapse
      archived={archived}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerSubtitles={savedTenant &&
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
              <CollapseHeaderSubtitle>
                <span>{LeaseTenantsFieldTitles.SHARE_FRACTION}:</span>
                {savedTenant.share_numerator || ''} / {savedTenant.share_denominator || ''}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE) && isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
              <CollapseHeaderSubtitle>
                <span>Välillä:</span>
                {formatDateRange(get(savedTenant, 'tenant.start_date'), get(savedTenant, 'tenant.end_date')) || '-'}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}
        </Authorization>
      }
      onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANT) ? onRemove : null}
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
                        fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}
                        name={`${field}.tenant.contact`}
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
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                  <FormTextTitle required={isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR) || isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}>
                    {LeaseTenantsFieldTitles.SHARE_FRACTION}
                  </FormTextTitle>
                  <Authorization
                    allow={
                      isFieldAllowedToEdit(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR) ||
                      isFieldAllowedToEdit(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)
                    }
                    errorComponent={<FormText>{shareNumerator || ''} / {shareDenominator || ''}</FormText>}
                  >
                    <Row>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}
                            invisibleLabel
                            name={`${field}.share_numerator`}
                            overrideValues={{label: LeaseTenantsFieldTitles.SHARE_NUMERATOR}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            className='with-slash'
                            fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}
                            invisibleLabel
                            name={`${field}.share_denominator`}
                            overrideValues={{label: LeaseTenantsFieldTitles.SHARE_DENIMONATOR}}
                          />
                        </Authorization>
                      </Column>
                    </Row>
                  </Authorization>
                </Authorization>
              </Column>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                  <FormTextTitle>{LeaseTenantsFieldTitles.SHARE_PERCENTAGE}</FormTextTitle>
                  <FormText>{!isEmptyValue(share) ? `${formatNumber(share)} %` : '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}
                    name={`${field}.tenant.start_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.START_DATE}}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}
                    name={`${field}.tenant.end_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.END_DATE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>

          <FormWrapperLeft>
            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.REFERENCE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.REFERENCE)}
                    name={`${field}.reference`}
                    overrideValues={{label: LeaseTenantsFieldTitles.REFERENCE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperLeft>
        </FormWrapper>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET)}>
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

        <FieldArray
          component={renderOtherTenants}
          contactType={TenantContactType.BILLING}
          name={`${field}.billing_persons`}
          showAddButton={!archived}
          tenant={savedTenant}
          usersPermissions={usersPermissions}
        />

        <FieldArray
          component={renderOtherTenants}
          contactType={TenantContactType.CONTACT}
          name={`${field}.contact_persons`}
          showAddButton={!archived}
          tenant={savedTenant}
          usersPermissions={usersPermissions}
        />
      </Authorization>
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
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.tenants.${id}`),
      contact: selector(state, `${props.field}.tenant.contact`),
      contactMethods: getContactMethods(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      shareDenominator: selector(state, `${props.field}.share_denominator`),
      shareNumerator: selector(state, `${props.field}.share_numerator`),
      tenantId: id,
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    receiveCollapseStates,
    receiveIsSaveClicked,
    showContactModal,
  },
)(TenantItemEdit);
