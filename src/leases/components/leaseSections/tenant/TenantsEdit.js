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
import {createContact, editContact, hideContactModal, receiveContactModalSettings, receiveTenantsFormValid} from '$src/leases/actions';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {FormNames} from '$src/leases/enums';
import {getContactModalSettings, getIsContactModalOpen, getIsTenantsFormValid} from '$src/leases/selectors';

import type {ContactModalSettings} from '$src/leases/types';

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  editContact: Function,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactModalOpen: boolean,
  isTenantsFormValid: boolean,
  receiveContactModalSettings: Function,
  receiveTenantsFormValid: Function,
  valid: boolean,
}

class TenantsEdit extends Component<Props> {
  componentWillMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  componentDidUpdate() {
    const {isTenantsFormValid, receiveTenantsFormValid, valid} = this.props;
    if(isTenantsFormValid !== valid) {
      receiveTenantsFormValid(valid);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {contactModalSettings} = nextProps;
    const {change, receiveContactModalSettings} = this.props;

    if(contactModalSettings && contactModalSettings.contactId) {
      change(contactModalSettings.field, contactModalSettings.contactId);
      receiveContactModalSettings(null);
    }
  }

  render () {
    const {
      contactModalSettings,
      contactFormValues,
      createContact,
      editContact,
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
        isContactModalOpen: getIsContactModalOpen(state),
        isTenantsFormValid: getIsTenantsFormValid(state),
      };
    },
    {
      change,
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveTenantsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(TenantsEdit);
