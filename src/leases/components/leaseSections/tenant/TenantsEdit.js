// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {change, FieldArray, getFormValues, reduxForm} from 'redux-form';
import get from 'lodash/get';

import ContactModal from './ContactModal';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
import TenantItemsEdit from './TenantItemsEdit';
import {createContact, editContact, hideContactModal, receiveContactModalSettings, receiveFormValidFlags} from '$src/leases/actions';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {FormNames} from '$src/leases/enums';
import {getContentContact, getContentTenantsFormData} from '$src/leases/helpers';
import {
  getContactModalSettings,
  getCurrentLease,
  getErrorsByFormName,
  getIsContactModalOpen,
  getIsSaveClicked,
} from '$src/leases/selectors';

import type {ContactModalSettings, Lease} from '$src/leases/types';

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  currentLease: Lease,
  editContact: Function,
  errors: ?Object,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactModalOpen: boolean,
  isSaveClicked: boolean,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  lease: Lease,
  tenantsData: Object,
}

class TenantsEdit extends Component<Props, State> {
  state = {
    lease: {},
    tenantsData: {},
  }

  componentDidMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.lease) {
      return {
        lease: props.currentLease,
        tenantsData: getContentTenantsFormData(props.currentLease),
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveContactModalSettings, receiveFormValidFlags} = this.props;
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
      isSaveClicked,
      receiveContactModalSettings,
    } = this.props;

    const {tenantsData} = this.state;
    const tenants = get(tenantsData, 'tenants', []);
    const tenantsArchived = get(tenantsData, 'tenantsArchived', []);

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
            <FieldArray
              component={TenantItemsEdit}
              enableAddButton={true}
              errors={errors}
              isSaveClicked={isSaveClicked}
              name="tenants.tenants"
              tenants={tenants}
            />

            {!!tenantsArchived.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
            {!!tenantsArchived.length &&
              <FieldArray
                component={TenantItemsEdit}
                enableAddButton={false}
                errors={errors}
                isSaveClicked={isSaveClicked}
                name="tenants.tenantsArchived"
                tenants={tenantsArchived}
              />
            }
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
        currentLease: getCurrentLease(state),
        errors: getErrorsByFormName(state, formName),
        isContactModalOpen: getIsContactModalOpen(state),
        isSaveClicked: getIsSaveClicked(state),
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
