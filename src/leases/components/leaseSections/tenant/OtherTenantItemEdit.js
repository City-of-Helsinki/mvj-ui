// @flow
import React from 'react';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
import {receiveCollapseStates, receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, TenantContactType} from '$src/leases/enums';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

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
  tenant: Object,
  tenantId: number,
}

const OtherTenantItemEdit = ({
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
  tenant,
  tenantId,
}: Props) => {
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
    onRemove(index);
  };

  const handleCollapseToggle = (val: boolean) => {
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
    tenantErrors = get(errors, field),
    tenantTypeOptions = getAttributeFieldOptions(attributes,
      'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);

  return (
    <Collapse
      className={classNames('collapse__secondary', {'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={<h4 className='collapse__header-title edit-row'>Laskunsaaja/yhteyshenkilö {index + 1}</h4>}
      onToggle={handleCollapseToggle}
    >
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
