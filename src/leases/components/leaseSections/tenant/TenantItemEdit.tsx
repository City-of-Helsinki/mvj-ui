import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import AddButtonThird from "/src/components/form/AddButtonThird";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import ContactTemplate from "/src/contacts/components/templates/ContactTemplate";
import EditButton from "/src/components/form/EditButton";
import FieldAndRemoveButtonWrapper from "/src/components/form/FieldAndRemoveButtonWrapper";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormWrapper from "/src/components/form/FormWrapper";
import FormWrapperLeft from "/src/components/form/FormWrapperLeft";
import FormWrapperRight from "/src/components/form/FormWrapperRight";
import OtherTenantItemEdit from "./OtherTenantItemEdit";
import RemoveButton from "/src/components/form/RemoveButton";
import SubTitle from "/src/components/content/SubTitle";
import { initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal } from "/src/contacts/actions";
import { receiveCollapseStates } from "/src/leases/actions";
import { ButtonColors } from "/src/components/enums";
import { ConfirmationModalTexts, FieldTypes, FormNames, Methods, ViewModes } from "enums";
import { LeaseTenantContactSetFieldPaths, LeaseTenantContactSetFieldTitles, LeaseTenantRentSharesFieldPaths, LeaseTenantRentSharesFieldTitles, LeaseTenantsFieldPaths, LeaseTenantsFieldTitles, TenantContactType } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContactFullName } from "/src/contacts/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { formatDateRange, getFieldAttributes, hasPermissions, isActive, isArchived, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired, isMethodAllowed } from "util/helpers";
import { getMethods as getContactMethods } from "/src/contacts/selectors";
import { getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { UsersPermissions as UsersPermissionsType, UserServiceUnit } from "usersPermissions/types";
type RentSharesProps = {
  archived: boolean;
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const renderRentShares = ({
  archived,
  attributes,
  fields,
  isSaveClicked,
  usersPermissions
}: RentSharesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            <SubTitle>{LeaseTenantRentSharesFieldTitles.RENT_SHARES}</SubTitle>

            {fields && !!fields.length && <Fragment>
                <Row>
                  <Column small={6} large={4}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)}>
                        {LeaseTenantRentSharesFieldTitles.INTENDED_USE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={6} large={4}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR) || isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                      <FormTextTitle required={isFieldRequired(attributes, LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR) || isFieldRequired(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                        {LeaseTenantRentSharesFieldTitles.SHARE_FRACTION}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((field, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_RENT_SHARE.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_RENT_SHARE.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_RENT_SHARE.TITLE
              });
            };

            return <Row key={index}>
                      <Column small={6} medium={4}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantRentSharesFieldPaths.INTENDED_USE)} name={`${field}.intended_use`} invisibleLabel overrideValues={{
                    label: LeaseTenantRentSharesFieldTitles.INTENDED_USE
                  }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantRentSharesFieldPaths.INTENDED_USE)} />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4}>
                        <FieldAndRemoveButtonWrapper field={<Row>
                              <Column small={6}>
                                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)} name={`${field}.share_numerator`} invisibleLabel overrideValues={{
                        label: LeaseTenantRentSharesFieldTitles.SHARE_NUMERATOR
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)} />
                                </Authorization>
                              </Column>
                              <Column small={6}>
                                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR)}>
                                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR)} name={`${field}.share_denominator`} className='with-slash' invisibleLabel overrideValues={{
                        label: LeaseTenantRentSharesFieldTitles.SHARE_DENOMINATOR
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR)} />
                                </Authorization>
                              </Column>
                            </Row>} removeButton={<Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANTRENTSHARE)}>
                              <RemoveButton className='third-level' onClick={handleRemove} title="Poista laskutusosuus" />
                            </Authorization>} />
                      </Column>
                    </Row>;
          })}
              </Fragment>}
            {!archived && <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TENANTRENTSHARE)}>
                <Row>
                  <Column>
                    <AddButtonThird label='Lisää laskutusosuus' onClick={handleAdd} />
                  </Column>
                </Row>
              </Authorization>}
          </Fragment>;
    }}
    </AppConsumer>;
};

type OtherTenantsProps = {
  contactType: "billing" | "contact";
  fields: any;
  serviceUnit: UserServiceUnit;
  showAddButton: boolean;
  tenant: Record<string, any>;
  usersPermissions: UsersPermissionsType;
};

const renderOtherTenants = ({
  contactType,
  fields,
  serviceUnit,
  showAddButton,
  tenant,
  usersPermissions
}: OtherTenantsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {fields && !!fields.length && fields.map((field, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_OTHER_TENANT.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_OTHER_TENANT.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_OTHER_TENANT.TITLE
            });
          };

          return <OtherTenantItemEdit key={index} contactType={contactType} field={field} onRemove={handleRemove} serviceUnit={serviceUnit} tenant={tenant} />;
        })}
            {showAddButton && <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TENANTCONTACT)}>
                <Row>
                  <Column>
                    <AddButtonSecondary className='no-top-margin' label={contactType === TenantContactType.BILLING ? 'Lisää laskunsaaja' : 'Lisää yhteyshenkilö'} onClick={handleAdd} />
                  </Column>
                </Row>
              </Authorization>}
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  collapseState: boolean;
  contact: Record<string, any> | null | undefined;
  contactMethods: MethodsType;
  errors: Record<string, any> | null | undefined;
  field: string;
  initializeContactForm: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  receiveContactModalSettings: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  serviceUnit: UserServiceUnit;
  shareDenominator: string | null | undefined;
  shareNumerator: string | null | undefined;
  showContactModal: (...args: Array<any>) => any;
  tenantId: number;
  tenants: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
};

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
  serviceUnit,
  shareDenominator,
  shareNumerator,
  showContactModal,
  tenantId,
  tenants,
  usersPermissions
}: Props) => {
  const getTenantById = (id: number) => {
    return id ? tenants.find(tenant => tenant.id === id) : {};
  };

  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
      contactId: null,
      isNew: true
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleEditClick = () => {
    initializeContactForm({ ...contact
    });
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
      contactId: null,
      isNew: false
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleCollapseToggle = (val: boolean) => {
    if (!tenantId) return;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          tenants: {
            [tenantId]: val
          }
        }
      }
    });
  };

  const savedTenant = getTenantById(tenantId);
  const active = isActive(savedTenant && savedTenant.tenant);
  const archived = isArchived(savedTenant && savedTenant.tenant);
  const tenantErrors = get(errors, field);
  return <Collapse archived={archived} defaultOpen={collapseState !== undefined ? collapseState : active} hasErrors={isSaveClicked && !isEmpty(tenantErrors)} headerSubtitles={savedTenant && <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
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
        </Fragment>} headerTitle={<Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}
        </Authorization>} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANT) ? onRemove : null} onToggle={handleCollapseToggle}>
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={9} medium={8}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.CONTACT)} name={`${field}.tenant.contact`} overrideValues={{
                  fieldType: FieldTypes.CONTACT,
                  label: LeaseTenantContactSetFieldTitles.CONTACT
                }} serviceUnit={serviceUnit} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.CONTACT)} />
                </Authorization>
              </Column>
              <Column small={3} medium={4}>
                <Authorization allow={isMethodAllowed(contactMethods, Methods.POST)}>
                  <div className='contact-buttons-wrapper'>
                    <AddButtonThird label='Luo asiakas' onClick={handleAddClick} />
                  </div>
                </Authorization>
              </Column>
            </Row>

            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.REFERENCE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.REFERENCE)} name={`${field}.reference`} overrideValues={{
                  label: LeaseTenantsFieldTitles.REFERENCE
                }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.REFERENCE)} />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR) && isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                  <FormTextTitle required={isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR) || isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR)} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.SHARE_FRACTION)}>
                    {LeaseTenantsFieldTitles.SHARE_FRACTION}
                  </FormTextTitle>
                  <Authorization allow={isFieldAllowedToEdit(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR) || isFieldAllowedToEdit(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR)} errorComponent={<FormText>{shareNumerator || ''} / {shareDenominator || ''}</FormText>}>
                    <Row>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                          <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)} invisibleLabel name={`${field}.share_numerator`} overrideValues={{
                          label: LeaseTenantsFieldTitles.SHARE_NUMERATOR
                        }} />
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR)}>
                          <FormField disableTouched={isSaveClicked} className='with-slash' fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_DENOMINATOR)} invisibleLabel name={`${field}.share_denominator`} overrideValues={{
                          label: LeaseTenantsFieldTitles.SHARE_DENOMINATOR
                        }} />
                        </Authorization>
                      </Column>
                    </Row>
                  </Authorization>
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.START_DATE)} name={`${field}.tenant.start_date`} overrideValues={{
                  label: LeaseTenantContactSetFieldTitles.START_DATE
                }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.START_DATE)} />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.END_DATE)} name={`${field}.tenant.end_date`} overrideValues={{
                  label: LeaseTenantContactSetFieldTitles.END_DATE
                }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.END_DATE)} />
                </Authorization>
              </Column>
            </Row>

            <Row>
              <Column small={12}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantRentSharesFieldPaths.RENT_SHARES)}>
                  <FieldArray component={renderRentShares} archived={archived} attributes={attributes} isSaveClicked={isSaveClicked} name={`${field}.rent_shares`} usersPermissions={usersPermissions} />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET)}>
        {!!contact && <SubTitle>Asiakkaan tiedot
            <Authorization allow={isMethodAllowed(contactMethods, Methods.PATCH)}>
              <EditButton className='inline-button' onClick={handleEditClick} title='Muokkaa asiakasta' />
            </Authorization>
          </SubTitle>}
        <ContactTemplate contact={contact} />

        <FieldArray component={renderOtherTenants} contactType={TenantContactType.BILLING} name={`${field}.billing_persons`} serviceUnit={serviceUnit} showAddButton={!archived} tenant={savedTenant} usersPermissions={usersPermissions} />

        <FieldArray component={renderOtherTenants} contactType={TenantContactType.CONTACT} name={`${field}.contact_persons`} serviceUnit={serviceUnit} showAddButton={!archived} tenant={savedTenant} usersPermissions={usersPermissions} />
      </Authorization>
    </Collapse>;
};

const formName = FormNames.LEASE_TENANTS;
const selector = formValueSelector(formName);
export default connect((state, props) => {
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
    usersPermissions: getUsersPermissions(state)
  };
}, {
  initializeContactForm,
  receiveContactModalSettings,
  receiveCollapseStates,
  receiveIsSaveClicked,
  showContactModal
})(TenantItemEdit);