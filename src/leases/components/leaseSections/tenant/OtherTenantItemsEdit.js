// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import classNames from 'classnames';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactInfoTemplate from '$src/contacts/components/ContactInfoTemplate';
import EditIcon from '$components/icons/EditIcon';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import IconButton from '$components/button/IconButton';
import RemoveButton from '$components/form/RemoveButton';
import {genericValidator} from '$components/form/validations';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {getTenantsFormValues} from '$src/leases/selectors';
import {TenantContactType} from '$src/leases/enums';
import {initializeContactForm} from '$src/contacts/actions';
import {getContactById, getContactOptions} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';

import type {Attributes as ContactAttributes, Contact} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: Array<Contact>,
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
            header={
              <div>
                <Column></Column>
                <Column>
                  <div className='collapse__header_field-wrapper'>
                    <div className='collapse__header_field-label-wrapper'>
                      <label>Välillä</label>
                    </div>
                    <div className='collapse__header_field-input-wrapper'>
                      <Column>
                        <Field
                          className='no-margin'
                          component={FieldTypeDatePicker}
                          name={`${tenant}.start_date`}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'tenants.child.children.tenantcontact_set.child.children.start_date')),
                          ]}
                        />
                      </Column>
                      <Column>
                        <Field
                          className='with-dash no-margin'
                          component={FieldTypeDatePicker}
                          name={`${tenant}.end_date`}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'tenants.child.children.tenantcontact_set.child.children.end_date')),
                          ]}
                        />
                      </Column>
                    </div>
                  </div>
                </Column>
              </div>
            }
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
              </Row>
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
                <ContactInfoTemplate
                  attributes={contactAttributes}
                  contact={contact}
                />
              </BoxContentWrapper>

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
      formValues: getTenantsFormValues(state),
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    showContactModal,
  }
)(OtherTenantItemsEdit);
