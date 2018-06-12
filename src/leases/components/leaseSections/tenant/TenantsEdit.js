// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {change, FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';

import ContactModal from './ContactModal';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';
import {createContact, editContact, hideContactModal, receiveContactModalSettings, receiveFormValidFlags} from '$src/leases/actions';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {FormNames} from '$src/leases/enums';
import {getContentContact} from '$src/leases/helpers';
import {getContactModalSettings, getErrorsByFormName, getIsContactModalOpen} from '$src/leases/selectors';

import type {ContactModalSettings} from '$src/leases/types';

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  editContact: Function,
  errors: ?Object,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactModalOpen: boolean,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class TenantsEdit extends Component<Props> {
  componentWillMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.TENANTS]: this.props.valid,
      });
    }

    if(contactModalSettings && contactModalSettings.contact) {
      change(
        contactModalSettings.field,
        getContentContact(contactModalSettings.contact)
      );
      receiveContactModalSettings(null);
    }
  }

  render () {
    const {
      contactModalSettings,
      contactFormValues,
      createContact,
      editContact,
      errors,
      handleSubmit,
      hideContactModal,
      isContactModalOpen,
      receiveContactModalSettings,
    } = this.props;

    return (
      <div>
        <ContactModal
          isOpen={isContactModalOpen}
          onCancel={() => {
            hideContactModal();
            receiveContactModalSettings(null);
          }}
          onClose={() => {
            hideContactModal();
            receiveContactModalSettings(null);
          }}
          onSave={() => {
            if(contactModalSettings && contactModalSettings.isNew) {
              createContact(contactFormValues);
            } else if(contactModalSettings && !contactModalSettings.isNew){
              editContact(contactFormValues);
            }
          }}
          onSaveAndAdd={() => {
            contactFormValues.isSelected = true;
            createContact(contactFormValues);
          }}
          showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
        />
        <form onSubmit={handleSubmit}>
          <h2>Vuokralaiset</h2>
          <Divider />

          <FormSection>
            <Row>
              <Column>
                <FieldArray
                  component={TenantItemsEdit}
                  errors={errors}
                  name="tenants"
                />
              </Column>
            </Row>
          </FormSection>
        </form>
      </div>
    );
  }
}

const formName = FormNames.TENANTS;

export default flowRight(
  connect(
    (state) => {
      return {
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(ContactFormNames.CONTACT)(state),
        errors: getErrorsByFormName(state, formName),
        isContactModalOpen: getIsContactModalOpen(state),
      };
    },
    {
      change,
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(TenantsEdit);
