import React, { Fragment } from "react";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import classNames from "classnames";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import AddButtonThird from "/src/components/form/AddButtonThird";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import ContactTemplate from "/src/contacts/components/templates/ContactTemplate";
import EditButton from "/src/components/form/EditButton";
import FormField from "/src/components/form/FormField";
import FormWrapper from "/src/components/form/FormWrapper";
import FormWrapperLeft from "/src/components/form/FormWrapperLeft";
import FormWrapperRight from "/src/components/form/FormWrapperRight";
import SubTitle from "/src/components/content/SubTitle";
import { initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal } from "/src/contacts/actions";
import { receiveCollapseStates } from "/src/leases/actions";
import { FieldTypes, FormNames, Methods, ViewModes } from "enums";
import { LeaseTenantContactSetFieldPaths, LeaseTenantContactSetFieldTitles, TenantContactType } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getUiDataLeaseKey } from "uiData/helpers";
import { formatDateRange, hasPermissions, isActive, isArchived, isFieldAllowedToRead, isMethodAllowed } from "util/helpers";
import { getMethods as getContactMethods } from "/src/contacts/selectors";
import { getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { UsersPermissions as UsersPermissionsType, UserServiceUnit } from "usersPermissions/types";
type Props = {
  attributes: Attributes;
  collapseState: boolean;
  contactMethods: MethodsType;
  contact: Record<string, any> | null | undefined;
  contactType: "billing" | "contact";
  errors: Record<string, any> | null | undefined;
  field: string;
  index: number;
  initializeContactForm: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  receiveContactModalSettings: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  serviceUnit: UserServiceUnit;
  showContactModal: (...args: Array<any>) => any;
  tenant: Record<string, any>;
  tenantId: number;
  usersPermissions: UsersPermissionsType;
};

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
  serviceUnit,
  showContactModal,
  tenant,
  tenantId,
  usersPermissions
}: Props) => {
  const getOtherTenantById = (id: number) => {
    const tenantContactSet = contactType === TenantContactType.BILLING ? get(tenant, 'billing_persons', []) : get(tenant, 'contact_persons', []);
    return id ? tenantContactSet.find(tenant => tenant.id === id) : null;
  };

  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.contact`,
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
      field: `${field}.contact`,
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
          others: {
            [tenantId]: val
          }
        }
      }
    });
  };

  const savedTenant = getOtherTenantById(tenantId),
        active = isActive(savedTenant),
        archived = isArchived(savedTenant),
        tenantErrors = get(errors, field);
  return <Collapse archived={archived} className={classNames('collapse__secondary')} defaultOpen={collapseState !== undefined ? collapseState : active} hasErrors={isSaveClicked && !isEmpty(tenantErrors)} headerSubtitles={<Fragment>
          <Column></Column>
          <Column>
            {savedTenant && <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE) && isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                <CollapseHeaderSubtitle>
                  <span>Välillä:</span>
                  {formatDateRange(savedTenant.start_date, savedTenant.end_date) || '-'}
                </CollapseHeaderSubtitle>
              </Authorization>}
          </Column>
        </Fragment>} headerTitle={<Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TYPE)}>
          {contactType === TenantContactType.BILLING ? 'Laskunsaaja' : 'Yhteyshenkilö'}
        </Authorization>} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANTCONTACT) ? onRemove : null} onToggle={handleCollapseToggle}>
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12}>
                <Row>
                  <Column small={9} medium={8}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                      <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.CONTACT)} name={`${field}.contact`} overrideValues={{
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
              </Column>
            </Row>
          </FormWrapperLeft>

          <FormWrapperRight>
            <Row>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.START_DATE)} name={`${field}.start_date`} overrideValues={{
                  label: LeaseTenantContactSetFieldTitles.START_DATE
                }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.START_DATE)} />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                  <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, LeaseTenantContactSetFieldPaths.END_DATE)} name={`${field}.end_date`} overrideValues={{
                  label: LeaseTenantContactSetFieldTitles.END_DATE
                }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantContactSetFieldPaths.END_DATE)} />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {!!contact && <SubTitle>Asiakkaan tiedot
              <Authorization allow={isMethodAllowed(contactMethods, Methods.PATCH)}>
                <EditButton className='inline-button' onClick={handleEditClick} title='Muokkaa asiakasta' />
              </Authorization>
            </SubTitle>}
          <ContactTemplate contact={contact} />
        </Authorization>
      </BoxContentWrapper>
    </Collapse>;
};

const formName = FormNames.LEASE_TENANTS;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  return {
    attributes: getAttributes(state),
    collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.others.${id}`),
    contact: selector(state, `${props.field}.contact`),
    contactMethods: getContactMethods(state),
    errors: getErrorsByFormName(state, formName),
    isSaveClicked: getIsSaveClicked(state),
    tenantId: id,
    usersPermissions: getUsersPermissions(state)
  };
}, {
  initializeContactForm,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal
})(OtherTenantItemEdit);