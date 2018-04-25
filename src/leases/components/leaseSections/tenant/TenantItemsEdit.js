// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, getFormValues} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactInfoTemplate from '$src/contacts/components/ContactInfoTemplate';
import EditIcon from '$components/icons/EditIcon';
import IconButton from '$components/button/IconButton';
import OtherTenantItemsEdit from './OtherTenantItemsEdit';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {initializeContactForm} from '$src/contacts/actions';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContactById, getContactOptions} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getCompleteContactList} from '$src/contacts/selectors';
import {getAttributes} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

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

const TenantItemsEdit = ({
  allContacts,
  attributes,
  fields,
  formValues,
  initializeContactForm,
  receiveContactModalSettings,
  showContactModal,
}: Props) => {
  const contactOptions = getContactOptions(allContacts);

  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = getContactById(allContacts, get(formValues, `${tenant}.tenant.contact`));
        const isActive = isTenantActive(get(formValues, `${tenant}.tenant`));

        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
            className={classNames({'not-active': !isActive})}
            defaultOpen={isActive}
            header={
              <div>
                <Column>
                  <div className='collapse__header_field-wrapper'>
                    <div className='collapse__header_field-label-wrapper'>
                      <label>Osuus murtolukuna</label>
                    </div>
                    <div className='collapse__header_field-input-wrapper'>
                      <Column>
                        <Field
                          className='no-margin'
                          component={FieldTypeText}
                          name={`${tenant}.share_numerator`}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'tenants.child.children.share_numerator')),
                          ]}
                        />
                      </Column>
                      <Column>
                        <Field
                          className='with-slash no-margin'
                          component={FieldTypeText}
                          name={`${tenant}.share_denominator`}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'tenants.child.children.share_denominator')),
                          ]}
                        />
                      </Column>
                    </div>
                  </div>
                </Column>
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
                          name={`${tenant}.tenant.start_date`}
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
                          name={`${tenant}.tenant.end_date`}
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
              <h3 className='collapse__header-title'>Vuokralainen {index + 1}</h3>
            }
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                label='Poista vuokralainen'
                onClick={() => fields.remove(index)}
                title='Poista vuokralainen'
              />
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Row>
                    <Column small={9} medium={8} large={8}>
                      <Field
                        component={FieldTypeSelect}
                        label='Asiakas'
                        name={`${tenant}.tenant.contact`}
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
                            field: `${tenant}.tenant.contact`,
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
              <BoxContentWrapper>
                {!!contact &&
                  <IconButton
                    className='position-topright'
                    onClick={() => {
                      initializeContactForm({...contact});
                      receiveContactModalSettings({
                        field: `${tenant}.tenant.contact`,
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
                  contact={contact}
                />
              </BoxContentWrapper>

              <Row>
                <Column small={6} medium={4} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Viite'
                    name={`${tenant}.tenant.reference`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.reference')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={8} large={8}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${tenant}.tenant.note`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.note')),
                    ]}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>

            <FieldArray
              component={OtherTenantItemsEdit}
              name={`${tenant}.tenantcontact_set`}
            />
          </Collapse>
        );
      })
      }
      <Row>
        <Column>
          <AddButton
            className='no-margin'
            label='Lisää uusi vuokralainen'
            onClick={() => fields.push({})}
            title='Lisää uusi vuokralainen'
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
  },
)(TenantItemsEdit);
