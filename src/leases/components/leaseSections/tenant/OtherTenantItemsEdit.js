// @flow
import React from 'react';
import {getFormValues} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditIcon from '$components/icons/EditIcon';
import FormField from '$components/form/FormField';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import IconButton from '$components/button/IconButton';
import RemoveButton from '$components/form/RemoveButton';
import {initializeContactForm, receiveIsSaveClicked} from '$src/contacts/actions';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {FormNames, TenantContactType} from '$src/leases/enums';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type OtherTenantItemProps = {
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
  tenant: Object,
}

const OtherTenantItem = ({
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
  tenant,
}: OtherTenantItemProps) => {
  const getOtherTenantById = (id: number) => {
    const tenantContactSet = get(tenant, 'tenantcontact_set', []);

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

  const handleRemoveClick = () => {
    fields.remove(index);
  };

  const contact = get(formValues, `${field}.contact`);
  const savedOtherTenant = getOtherTenantById(get(formValues, `${field}.id`));
  const isActive = isTenantActive(savedOtherTenant);
  const tenantErrors = get(errors, field);

  const tenantTypeOptions = getAttributeFieldOptions(attributes,
    'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={
        <h4 className='collapse__header-title edit-row'>Laskunsaaja/yhteyshenkilö {index + 1}</h4>
      }>
      <BoxContentWrapper>
        <RemoveButton
          className='position-topright'
          label='Poista henkilö'
          onClick={handleRemoveClick}
          title='Poista henkilö'
        />
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
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.type')}
                  name={`${field}.type`}
                  overrideValues={{
                    label: 'Rooli',
                    options: tenantTypeOptions,
                  }}
                />
              </Column>
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

        <BoxContentWrapper>
          {!!contact &&
            <IconButton
              className='position-topright'
              disabled={!contact}
              onClick={handleEditClick}
            >
              <EditIcon className='icon-medium' />
            </IconButton>
          }
          <ContactTemplate contact={contact} />
        </BoxContentWrapper>
      </BoxContentWrapper>
    </Collapse>
  );
};

type Props = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenant: Object,
}

const OtherTenantItemsEdit = ({
  attributes,
  errors,
  fields,
  formValues,
  initializeContactForm,
  isSaveClicked,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenant,
}: Props) => {
  return (
    <div>
      {fields && !!fields.length && fields.map((field, index) => {
        return (
          <OtherTenantItem
            key={index}
            attributes={attributes}
            errors={errors}
            field={field}
            fields={fields}
            formValues={formValues}
            index={index}
            initializeContactForm={initializeContactForm}
            isSaveClicked={isSaveClicked}
            receiveContactModalSettings={receiveContactModalSettings}
            receiveIsSaveClicked={receiveIsSaveClicked}
            showContactModal={showContactModal}
            tenant={tenant}
          />
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää laskunsaaja tai yhteyshenkilö'
            onClick={() => fields.push({})}
            title='Lisää laskunsaaja tai yhteyshenkilö'
          />
        </Column>
      </Row>
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
  }
)(OtherTenantItemsEdit);
