// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import OtherTenantItemEdit from './OtherTenantItemEdit';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type OtherTenantsProps = {
  fields: any,
  tenant: Object,
}

const renderOtherTenants = ({
  fields,
  tenant,
}: OtherTenantsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  const handleRemove = (index: number) => fields.remove(index);

  return (
    <div>
      {fields && !!fields.length && fields.map((field, index) => {
        return (
          <OtherTenantItemEdit
            key={index}
            field={field}
            index={index}
            onRemove={handleRemove}
            tenant={tenant}
          />
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää laskunsaaja tai yhteyshenkilö'
            onClick={handleAdd}
            title='Lisää laskunsaaja tai yhteyshenkilö'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
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
  tenantId: number,
  tenants: Array<Object>,
}

const TenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  errors,
  field,
  index,
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

  const handleAddKeyDown = (e:any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleAddClick();
    }
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

  const handleRemoveClick = () => {
    onRemove(index);
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
      headerTitle={<h3 className='collapse__header-title'>{getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}</h3>}
      onRemove={handleRemoveClick}
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
                      <a onKeyDown={handleAddKeyDown} onClick={handleAddClick} tabIndex={0}>Luo asiakas</a>
                    </div>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <FormFieldLabel required>Osuus murtolukuna</FormFieldLabel>
                <Row>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'tenants.child.children.share_numerator')}
                      name={`${field}.share_numerator`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column>
                    <FormField
                      disableTouched={isSaveClicked}
                      className='with-slash'
                      fieldAttributes={get(attributes, 'tenants.child.children.share_denominator')}
                      name={`${field}.share_denominator`}
                      overrideValues={{
                        label: '',
                      }}
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
        </FormWrapper>

        <BoxContentWrapper>
          {!!contact &&
            <EditButton
              className='position-topright'
              onClick={handleEditClick}
              title='Muokkaa'
            />
          }
          <ContactTemplate contact={contact} />
        </BoxContentWrapper>

        <FormWrapper>
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

      <FieldArray
        component={renderOtherTenants}
        name={`${field}.tenantcontact_set`}
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
