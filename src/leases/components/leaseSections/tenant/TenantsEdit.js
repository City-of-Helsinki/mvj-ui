// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Authorization from '$components/authorization/Authorization';
import AddButton from '$components/form/AddButton';
import ContactModal from '$src/contacts/components/ContactModal';
import Divider from '$components/content/Divider';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import TenantItemEdit from './TenantItemEdit';
import {
  createContactOnModal as createContact,
  editContactOnModal as editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveIsSaveClicked,
} from '$src/contacts/actions';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
} from '$src/leases/enums';
import {validateTenantForm} from '$src/leases/formValidators';
import {isFieldAllowedToEdit} from '$util/helpers';
import {getContentContact} from '$src/contacts/helpers';
import {getContentTenantsFormData} from '$src/leases/helpers';
import {
  getMethods as getContactMethods,
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';

import type {Attributes, Methods} from '$src/types';
import type {ContactModalSettings} from '$src/contacts/types';
import type {Lease} from '$src/leases/types';

type TenantsProps = {
  fields: any,
  leaseAttributes: Attributes,
  showAddButton: boolean,
  tenants: Array<Object>,
}

const renderTenants = ({
  fields,
  leaseAttributes,
  showAddButton,
  tenants,
}: TenantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!showAddButton && fields && !!fields.length &&
              <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
            }

            {fields && !!fields.length && fields.map((tenant, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.TENANT,
                  confirmationModalTitle: DeleteModalTitles.TENANT,
                });
              };

              return (
                <TenantItemEdit
                  key={index}
                  field={tenant}
                  index={index}
                  onRemove={handleRemove}
                  tenants={tenants}
                />
              );
            })}
            {showAddButton &&
              <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}>
                <Row>
                  <Column>
                    <AddButton
                      className='no-margin'
                      label='Lisää vuokralainen'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
            }
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  contactFormValues: Object,
  contactMethods: Methods,
  contactModalSettings: ContactModalSettings,
  createContact: Function,
  currentLease: Lease,
  editContact: Function,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isFetchingContact: boolean,
  leaseAttributes: Attributes,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  valid: boolean,
}

type State = {
  currentLease: Lease,
  savedTenants: Object,
}

class TenantsEdit extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    savedTenants: {},
  }

  componentDidMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.lease) {
      return {
        currentLease: props.currentLease,
        savedTenants: getContentTenantsFormData(props.currentLease),
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
      // Update contact dropdown after creating/patching a contact
      change(contactModalSettings.field, getContentContact(contactModalSettings.contact));
      receiveContactModalSettings(null);
    }
  }

  handleCancel = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  handleClose = () => {
    const {hideContactModal, receiveContactModalSettings} = this.props;

    hideContactModal();
    receiveContactModalSettings(null);
  }

  handleSave = () => {
    const {
      contactFormValues,
      contactModalSettings,
      createContact,
      editContact,
      isContactFormValid,
      receiveIsSaveClicked,
    } = this.props;

    receiveIsSaveClicked(true);

    if(!isContactFormValid) return;

    if(contactModalSettings && contactModalSettings.isNew) {
      createContact(contactFormValues);
    } else if(contactModalSettings && !contactModalSettings.isNew){
      editContact(contactFormValues);
    }
  }

  handleSaveAndAdd = () => {
    const {contactFormValues, createContact, isContactFormValid, receiveIsSaveClicked} = this.props,
      contact = {...contactFormValues};

    receiveIsSaveClicked(true);

    if(!isContactFormValid) return;

    contact.isSelected = true;
    createContact(contact);
  }

  render () {
    const {
      contactMethods,
      contactModalSettings,
      handleSubmit,
      isContactModalOpen,
      isFetchingContact,
      leaseAttributes,
    } = this.props;

    const {savedTenants} = this.state;
    const tenants = savedTenants.tenants,
      tenantsArchived = savedTenants.tenantsArchived;

    return (
      <Fragment>
        {isFetchingContact && <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>}

        <Authorization allow={contactMethods.POST || contactMethods.PATCH}>
          <ContactModal
            isOpen={isContactModalOpen}
            onCancel={this.handleCancel}
            onClose={this.handleClose}
            onSave={this.handleSave}
            onSaveAndAdd={this.handleSaveAndAdd}
            showSave={contactModalSettings && !contactModalSettings.isNew}
            showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
            title={(contactModalSettings && contactModalSettings.isNew)
              ? 'Uusi asiakas'
              : 'Muokkaa asiakasta'
            }
          />
        </Authorization>

        <form onSubmit={handleSubmit}>
          <h2>{LeaseTenantsFieldTitles.TENANTS}</h2>
          <Divider />

          <FieldArray
            component={renderTenants}
            leaseAttributes={leaseAttributes}
            name='tenants'
            showAddButton={true}
            tenants={tenants}
          />

          <FieldArray
            component={renderTenants}
            leaseAttributes={leaseAttributes}
            name='tenantsArchived'
            showAddButton={false}
            tenants={tenantsArchived}
          />
        </form>
      </Fragment>
    );
  }
}

const formName = FormNames.TENANTS;

export default flowRight(
  connect(
    (state) => {
      return {
        contactMethods: getContactMethods(state),
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(ContactFormNames.CONTACT)(state),
        currentLease: getCurrentLease(state),
        isContactFormValid: getIsContactFormValid(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveFormValidFlags,
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateTenantForm,
  }),
)(TenantsEdit);
