// @flow
import React from 'react';
import {getFormValues} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';

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
import {getContactById, getContactOptions} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getCompleteContactList} from '$src/contacts/selectors';
import {getAttributes} from '$src/leases/selectors';

import type {Contact} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: Array<Contact>,
  attributes: Attributes,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  receiveContactModalSettings: Function,
  showContactModal: Function,
}

const OtherTenantItemsEdit = ({
  allContacts,
  attributes,
  fields,
  formValues,
  initializeContactForm,
  receiveContactModalSettings,
  showContactModal,
}: Props) => {
  const contactOptions = getContactOptions(allContacts);
  const tenantTypeOptions = getAttributeFieldOptions(attributes,
    'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);

  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = getContactById(allContacts, get(formValues, `${tenant}.contact`));
        const isActive = isTenantActive(get(formValues, tenant));

        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
            className={classNames('collapse__secondary', {'not-active': !isActive})}
            defaultOpen={isActive}
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
                            fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.contact')}
                            name={`${tenant}.contact`}
                            overrideValues={{
                              label: 'Asiakas',
                              options: contactOptions,
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
                            }}>Luo uusi asiakas</a>
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
                        className='no-margin'
                        fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.start_date')}
                        name={`${tenant}.start_date`}
                        overrideValues={{
                          label: 'Alkupvm',
                        }}
                      />
                    </Column>
                    <Column small={6} medium={3} large={2}>
                      <FormField
                        className='with-dash no-margin'
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
      allContacts: getCompleteContactList(state),
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
