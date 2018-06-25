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
import {initializeContactForm} from '$src/contacts/actions';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {FormNames, TenantContactType} from '$src/leases/enums';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  receiveContactModalSettings: Function,
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
  showContactModal,
  tenant,
}: Props) => {
  const getOtherTenantById = (id: number) => {
    const tenantContactSet = get(tenant, 'tenantcontact_set', []);
    if(!id) {
      return null;
    }

    return tenantContactSet.find((tenant) => tenant.id === id);
  };

  const tenantTypeOptions = getAttributeFieldOptions(attributes,
    'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);

  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = get(formValues, `${tenant}.contact`);
        const savedOtherTenant = getOtherTenantById(get(formValues, `${tenant}.id`));
        const isActive = isTenantActive(savedOtherTenant);
        const tenantErrors = get(errors, tenant);

        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
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
                onClick={() => fields.remove(index)}
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
                            name={`${tenant}.contact`}
                            overrideValues={{
                              fieldType: 'contact',
                              label: 'Asiakas',
                            }}
                          />
                        </Column>
                        <Column small={3} medium={4} large={4}>
                          <div className='contact-buttons-wrapper'>
                            <a onClick={() => {
                              initializeContactForm({});
                              receiveContactModalSettings({
                                field: `${tenant}.contact`,
                                contactId: null,
                                isNew: true,
                              });
                              showContactModal();
                            }}>Luo asiakas</a>
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
                        name={`${tenant}.type`}
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
                        name={`${tenant}.start_date`}
                        overrideValues={{
                          label: 'Alkupvm',
                        }}
                      />
                    </Column>
                    <Column small={6} medium={3} large={2}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.end_date')}
                        name={`${tenant}.end_date`}
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
                    onClick={() => {
                      initializeContactForm({...contact});
                      receiveContactModalSettings({
                        field: `${tenant}.contact`,
                        contactId: null,
                        isNew: false,
                      });
                      showContactModal();
                    }}
                  >
                    <EditIcon
                      className='icon-medium'
                    />
                  </IconButton>
                }
                <ContactTemplate
                  contact={contact}
                />
              </BoxContentWrapper>
            </BoxContentWrapper>
          </Collapse>
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
    showContactModal,
  }
)(OtherTenantItemsEdit);
