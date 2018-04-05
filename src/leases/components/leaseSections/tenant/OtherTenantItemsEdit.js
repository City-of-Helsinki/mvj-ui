// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddIcon from '$components/icons/AddIcon';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactInfo from './ContactInfo';
import EditIcon from '$components/icons/EditIcon';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import IconButton from '$components/button/IconButton';
import RemoveButton from '$components/form/RemoveButton';
import {getTenantsFormValues} from '$src/leases/selectors';
import {getAttributeFieldOptions, getContactOptions} from '$util/helpers';
import {TenantContactType} from '$src/leases/enums';
import {genericValidator} from '$components/form/validations';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {initializeContactForm} from '$src/contacts/actions';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  receiveContactModalSettings: Function,
  showContactModal: Function,
}

const OtherTenantItemsEdit = ({
  allContacts,
  attributes,
  contactAttributes,
  fields,
  formValues,
  initializeContactForm,
  receiveContactModalSettings,
  showContactModal,
}: Props) => {
  const findContact = (id: string) => {
    if(!allContacts || !allContacts.length) {
      return null;
    }
    return allContacts.find((x) => x.id === id);
  };
  const contactOptions = getContactOptions(allContacts);
  const tenantTypeOptions = getAttributeFieldOptions(attributes,
    'tenants.child.children.tenantcontact_set.child.children.type').filter((x) => x.value !== TenantContactType.TENANT);
  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = findContact(get(formValues, `${tenant}.contact`));
        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
            className='collapse__secondary'
            defaultOpen={true}
            header={
              <Row>
                <Column small={12}>
                  <h4 className='collapse__header-title'>Laskunsaaja/yhteyshenkilö {index + 1}</h4>
                </Column>
              </Row>
            }>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                label='Poista henkilö'
                onClick={() => fields.remove(index)}
                title='Poista henkilö'
              />
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Row>
                    <Column small={9} medium={8} large={8}>
                      <Field
                        name={`${tenant}.contact`}
                        component={FieldTypeSelect}
                        label='Asiakas'
                        options={contactOptions}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'tenants.child.children.tenantcontact_set.child.children.contact')),
                        ]}
                      />
                    </Column>
                    <Column small={3} medium={4} large={4}>
                      <div className='contact-buttons-wrapper'>
                        <IconButton
                          onClick={() => {
                            initializeContactForm({});
                            receiveContactModalSettings({
                              field: `${tenant}.contact`,
                              contactId: null,
                              isNew: true,
                            });
                            showContactModal();
                          }}
                        >
                          <AddIcon
                            className='icon-medium'
                          />
                        </IconButton>
                        <IconButton
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
                      </div>
                    </Column>
                  </Row>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Rooli'
                    name={`${tenant}.type`}
                    options={tenantTypeOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.type')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Alkupäivämäärä'
                    name={`${tenant}.start_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.start_date')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Loppupäivämäärä'
                    name={`${tenant}.end_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.end_date')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${tenant}.note`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.note')),
                    ]}
                  />
                </Column>
              </Row>

              <ContactInfo
                contact={contact}
                contactAttributes={contactAttributes}
              />
            </BoxContentWrapper>
          </Collapse>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            className='uppercase-label'
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
      formValues: getTenantsFormValues(state),
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    showContactModal,
  }
)(OtherTenantItemsEdit);
