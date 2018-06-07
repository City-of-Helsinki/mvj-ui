// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

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
import {initializeContactForm} from '$src/contacts/actions';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {isTenantActive} from '$src/leases/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  receiveContactModalSettings: Function,
  showContactModal: Function,
}

const TenantItemsEdit = ({
  attributes,
  fields,
  formValues,
  initializeContactForm,
  receiveContactModalSettings,
  showContactModal,
}: Props) => {
  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = get(formValues, `${tenant}.tenant.contact`);
        const isActive = isTenantActive(get(formValues, `${tenant}.tenant`));

        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
            className={classNames({'not-active': !isActive})}
            defaultOpen={isActive}
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
              <FormWrapper>
                <FormWrapperLeft>
                  <Row>
                    <Column small={12} large={8}>
                      <Row>
                        <Column small={9} medium={8} large={8}>
                          <FormField
                            fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.contact')}
                            name={`${tenant}.tenant.contact`}
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
                                field: `${tenant}.tenant.contact`,
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
                      <FormFieldLabel required>Osuus murtolukuna</FormFieldLabel>
                      <Row>
                        <Column>
                          <FormField
                            fieldAttributes={get(attributes, 'tenants.child.children.share_numerator')}
                            name={`${tenant}.share_numerator`}
                            overrideValues={{
                              label: '',
                            }}
                          />
                        </Column>
                        <Column>
                          <FormField
                            className='with-slash'
                            fieldAttributes={get(attributes, 'tenants.child.children.share_denominator')}
                            name={`${tenant}.share_denominator`}
                            overrideValues={{
                              label: '',
                            }}
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column small={6} medium={3} large={2}>
                      <FormField
                        fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.start_date')}
                        name={`${tenant}.tenant.start_date`}
                        overrideValues={{
                          label: 'Alkupvm',
                        }}
                      />
                    </Column>
                    <Column small={6} medium={3} large={2}>
                      <FormField
                        fieldAttributes={get(attributes, 'tenants.child.children.tenantcontact_set.child.children.end_date')}
                        name={`${tenant}.tenant.end_date`}
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
                <ContactTemplate
                  contact={contact}
                />
              </BoxContentWrapper>

              <FormWrapper>
                <FormWrapperLeft>
                  <Row>
                    <Column>
                      <FormField
                        fieldAttributes={get(attributes, 'tenants.child.children.reference')}
                        name={`${tenant}.reference`}
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
            label='Lisää vuokralainen'
            onClick={() => fields.push({})}
            title='Lisää vuokralainen'
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
  },
)(TenantItemsEdit);
