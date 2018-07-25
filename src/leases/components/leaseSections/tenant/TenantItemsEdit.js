// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditIcon from '$components/icons/EditIcon';
import IconButton from '$components/button/IconButton';
import OtherTenantItemsEdit from './OtherTenantItemsEdit';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import RemoveButton from '$components/form/RemoveButton';
import {initializeContactForm, receiveIsSaveClicked} from '$src/contacts/actions';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type TenantItemProps = {
  attributes: Attributes,
  errors: ?Object,
  field: string,
  fields: any,
  formValues: Object,
  index: number,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenants: Array<Object>,
}

const TenantItem = ({
  attributes,
  errors,
  field,
  fields,
  formValues,
  index,
  initializeContactForm,
  isSaveClicked,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenants,
}: TenantItemProps) => {
  const getTenantById = (id: number) => {
    if(!id) {
      return {};
    }
    return tenants.find((tenant) => tenant.id === id);
  };
  const contact = get(formValues, `${field}.tenant.contact`);

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

  const handleRemoveClick = () => {
    fields.remove(index);
  };

  const savedTenant = getTenantById(get(formValues, `${field}.id`));
  const isActive = isTenantActive(get(savedTenant, 'tenant'));
  const tenantErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={
        <h3 className='collapse__header-title'>{getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}</h3>
      }
    >
      <BoxContentWrapper>
        <RemoveButton
          className='position-topright'
          label='Poista vuokralainen'
          onClick={handleRemoveClick}
          title='Poista vuokralainen'
        />
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
                      <a onClick={handleAddClick}>Luo asiakas</a>
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
            <IconButton
              className='position-topright'
              onClick={handleEditClick}
            >
              <EditIcon className='icon-medium' />
            </IconButton>
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
        component={OtherTenantItemsEdit}
        errors={errors}
        isSaveClicked={isSaveClicked}
        name={`${field}.tenantcontact_set`}
        tenant={savedTenant}
      />
    </Collapse>
  );
};

type Props = {
  attributes: Attributes,
  enableAddButton: boolean,
  errors: ?Object,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenants: Array<Object>,
}

const TenantItemsEdit = ({
  attributes,
  enableAddButton,
  errors,
  fields,
  formValues,
  initializeContactForm,
  isSaveClicked,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenants,
}: Props) => {
  const handleAddButton = () => {
    fields.push({});
  };

  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        return (
          <TenantItem
            key={index}
            attributes={attributes}
            errors={errors}
            field={tenant}
            fields={fields}
            formValues={formValues}
            index={index}
            initializeContactForm={initializeContactForm}
            isSaveClicked={isSaveClicked}
            receiveContactModalSettings={receiveContactModalSettings}
            receiveIsSaveClicked={receiveIsSaveClicked}
            showContactModal={showContactModal}
            tenants={tenants}
          />
        );

      })}
      {enableAddButton &&
        <Row>
          <Column>
            <AddButton
              className='no-margin'
              label='Lisää vuokralainen'
              onClick={handleAddButton}
              title='Lisää vuokralainen'
            />
          </Column>
        </Row>
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      formValues: getFormValues(FormNames.TENANTS)(state),
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    receiveIsSaveClicked,
    showContactModal,
  },
)(TenantItemsEdit);
