// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import OtherTenantItemEdit from './OtherTenantItemEdit';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames, TenantContactType} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

const ContactType = PropTypes.oneOf([TenantContactType.BILLING, TenantContactType.CONTACT]);

type OtherTenantsProps = {
  contactType: ContactType,
  fields: any,
  tenant: Object,
}

const renderOtherTenants = ({
  contactType,
  fields,
  tenant,
}: OtherTenantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
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
            <Row>
              <Column>
                <AddButtonSecondary
                  className='no-top-margin'
                  label={(contactType === TenantContactType.BILLING) ? 'Lisää laskunsaaja' : 'Lisää yhteyshenkilö'}
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contact: ?Object,
  errors: ?Object,
  field: string,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenantId: number,
  tenants: Array<Object>,
}

const TenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenantId,
  tenants,
}: Props) => {
  const getTenantById = (id: number) => {
    if(!id) {
      return {};
    }
    return tenants.find((tenant) => tenant.id === id);
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
    if(!tenantId) {return;}

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

  const savedTenant = getTenantById(tenantId);
  const isActive = isTenantActive(get(savedTenant, 'tenant'));
  const tenantErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={<CollapseHeaderTitle>{getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}</CollapseHeaderTitle>}
      onRemove={onRemove}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12} large={8}>
                <Row>
                  <Column small={9} medium={8} large={8}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.contact')}
                      name={`${field}.tenant.contact`}
                      overrideValues={{
                        fieldType: 'contact',
                        label: 'Asiakas',
                      }}
                    />
                  </Column>
                  <Column small={3} medium={4} large={4}>
                    <div className='contact-buttons-wrapper'>
                      <AddButtonThird
                        label='Luo asiakas'
                        onClick={handleAddClick}
                      />
                    </div>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <FormTextTitle required title='Osuus murtolukuna' />
                <Row>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'tenants.child.children.share_numerator')}
                      invisibleLabel
                      name={`${field}.share_numerator`}
                    />
                  </Column>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      className='with-slash'
                      fieldAttributes={get(attributes, 'tenants.child.children.share_denominator')}
                      invisibleLabel
                      name={`${field}.share_denominator`}
                    />
                  </Column>
                </Row>
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.start_date')}
                  name={`${field}.tenant.start_date`}
                  overrideValues={{
                    label: 'Alkupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.end_date')}
                  name={`${field}.tenant.end_date`}
                  overrideValues={{
                    label: 'Loppupvm',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperRight>

          <FormWrapperLeft>
            <Row>
              <Column>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.reference')}
                  name={`${field}.reference`}
                  overrideValues={{
                    label: 'Viite',
                  }}
                />
              </Column>
            </Row>
          </FormWrapperLeft>
        </FormWrapper>
      </BoxContentWrapper>

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

      <FieldArray
        component={renderOtherTenants}
        contactType={TenantContactType.BILLING}
        name={`${field}.billing_persons`}
        tenant={savedTenant}
      />

      <FieldArray
        component={renderOtherTenants}
        contactType={TenantContactType.CONTACT}
        name={`${field}.contact_persons`}
        tenant={savedTenant}
      />
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
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      tenantId: id,
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
