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
import FormText from '$components/form/FormText';
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
import {ContactTypes, FormNames as ContactFormNames} from '$src/contacts/enums';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {validateTenantForm} from '$src/leases/formValidators';
import {hasPermissions, isEmptyValue, isFieldAllowedToEdit} from '$util/helpers';
import {getContentContact} from '$src/contacts/helpers';
import {getContentTenantsFormData} from '$src/leases/helpers';
import {fetchContacts} from '$src/contacts/requestsOutsideSaga';
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
import {getUsersPermissions} from '$src/usersPermissions/selectors';


import type {Attributes, Methods} from '$src/types';
import type {ContactModalSettings} from '$src/contacts/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type TenantsProps = {
  archived: boolean,
  fields: any,
  leaseAttributes: Attributes,
  tenants: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const renderTenants = ({
  archived,
  fields,
  leaseAttributes,
  tenants,
  usersPermissions,
}: TenantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {archived && fields && !!fields.length &&
              <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
            }
            {!isFieldAllowedToEdit(leaseAttributes, LeaseTenantsFieldPaths.TENANTS) &&
              !archived &&
              (!fields || !fields.length) &&
              <FormText className='no-margin'>Ei vuokralaisia</FormText>
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
            {!archived &&
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TENANT)}>
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
  usersPermissions: UsersPermissionsType,
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
      console.log('contact', contactModalSettings);
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

  createOrEditContact = () => {
    const {
      contactFormValues,
      contactModalSettings,
      createContact,
      editContact,
    } = this.props;

    if(contactModalSettings && contactModalSettings.isNew) {
      createContact(contactFormValues);
    } else if(contactModalSettings && !contactModalSettings.isNew){
      editContact(contactFormValues);
    }
  }

  render () {
    const {
      contactMethods,
      contactModalSettings,
      handleSubmit,
      isContactModalOpen,
      isFetchingContact,
      leaseAttributes,
      usersPermissions,
    } = this.props;

    const {savedTenants} = this.state;
    const tenants = savedTenants.tenants,
      tenantsArchived = savedTenants.tenantsArchived;

    return (
      <AppConsumer>
        {({dispatch}) => {
          const handleCreateOrEdit = async() => {
            const {contactFormValues, contactModalSettings, isContactFormValid, receiveIsSaveClicked} = this.props;
            const {business_id, national_identification_number, type} = contactFormValues;

            receiveIsSaveClicked(true);

            if(!isContactFormValid) return;

            if(!contactModalSettings.isNew) {
              this.createOrEditContact();
              return;
            }

            if(type !== ContactTypes.PERSON && !isEmptyValue(business_id)) {
              const contacts = await fetchContacts({business_id});

              if(contacts.length) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createOrEditContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: 'Luo asiakas',
                  confirmationModalLabel: <span>{`Y-tunnuksella ${business_id} on jo olemassa asiakas`}<br />Haluatko luoda asiakkaan?</span>,
                  confirmationModalTitle: 'Luo asiakas',
                });
              } else {
                this.createOrEditContact();
              }
            } else if(type === ContactTypes.PERSON && !isEmptyValue(national_identification_number)) {
              const contacts = await fetchContacts({national_identification_number});

              if(contacts.length) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createOrEditContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: 'Luo asiakas',
                  confirmationModalLabel: <span>{`Henkilötunnuksella ${national_identification_number} on jo olemassa asiakas`}<br />Haluatko luoda asiakkaan?</span>,
                  confirmationModalTitle: 'Luo asiakas',
                });
              } else {
                this.createOrEditContact();
              }
            } else {
              this.createOrEditContact();
            }
          };

          return(
            <Fragment>
              {isFetchingContact && <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>}

              <Authorization allow={contactMethods.POST || contactMethods.PATCH}>
                <ContactModal
                  isOpen={isContactModalOpen}
                  onCancel={this.handleCancel}
                  onClose={this.handleClose}
                  onSave={handleCreateOrEdit}
                  onSaveAndAdd={handleCreateOrEdit}
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
                  tenants={tenants}
                  usersPermissions={usersPermissions}
                />

                <FieldArray
                  component={renderTenants}
                  leaseAttributes={leaseAttributes}
                  name='tenantsArchived'
                  archived
                  tenants={tenantsArchived}
                  usersPermissions={usersPermissions}
                />
              </form>
            </Fragment>
          );
        }}
      </AppConsumer>
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
        usersPermissions: getUsersPermissions(state),
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
