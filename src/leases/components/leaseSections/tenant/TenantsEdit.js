// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {change, reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import ContactModal from './ContactModal';
import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';
import {getContactModalSettings, getIsContactModalOpen, getIsTenantsFormValid} from '$src/leases/selectors';
import {createContact, editContact, hideContactModal, receiveContactModalSettings, receiveTenantsFormValid} from '$src/leases/actions';
import {getContactFormValues} from '$src/contacts/selectors';

import type {Attributes as ContactAttributes, ContactList} from '$src/contacts/types';
import type {Attributes, ContactModalSettings} from '$src/leases/types';

type Props = {
  allContacts: ContactList,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  dispatch: Function,
  editContact: Function,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactModalOpen: boolean,
  isTenantsFormValid: boolean,
  receiveContactModalSettings: Function,
  receiveTenantsFormValid: Function,
  valid: boolean,
}

class TenantsEdit extends Component {
  props: Props

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
    const {dispatch, receiveContactModalSettings} = this.props;
    if(contactModalSettings && contactModalSettings.contactId) {
      dispatch(change('tenants-form', contactModalSettings.field, contactModalSettings.contactId));
      receiveContactModalSettings(null);
    }
  }

  render () {
    const {
      allContacts,
      attributes,
      contactAttributes,
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
          contactAttributes={contactAttributes}
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
        />
        <form onSubmit={handleSubmit}>
          <FormSection>
            <Row>
              <Column>
                <FieldArray
                  allContacts={allContacts}
                  attributes={attributes}
                  component={TenantItemsEdit}
                  contactAttributes={contactAttributes}
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

const formName = 'tenants-form';

export default flowRight(
  connect(
    (state) => {
      return {
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getContactFormValues(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isTenantsFormValid: getIsTenantsFormValid(state),
      };
    },
    {
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
