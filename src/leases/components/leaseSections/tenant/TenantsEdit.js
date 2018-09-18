// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import ContactModal from '$src/contacts/components/ContactModal';
import Divider from '$components/content/Divider';
import FormSection from '$components/form/FormSection';
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
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentContact} from '$src/contacts/helpers';
import {getContentTenantsFormData} from '$src/leases/helpers';
import {
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {ContactModalSettings} from '$src/contacts/types';
import type {Lease} from '$src/leases/types';

type TenantsProps = {
  fields: any,
  showAddButton: boolean,
  tenants: Array<Object>,
}

const renderTenants = ({
  fields,
  showAddButton,
  tenants,
}: TenantsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!showAddButton && fields && !!fields.length && <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>}
            {fields && !!fields.length && fields.map((tenant, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.TENANT,
                  deleteModalTitle: DeleteModalTitles.TENANT,
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
              <Row>
                <Column>
                  <AddButton
                    className='no-margin'
                    label='Lisää vuokralainen'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  currentLease: Lease,
  editContact: Function,
  handleSubmit: Function,
  hideContactModal: Function,
  isContactFormValid: boolean,
  isContactModalOpen: boolean,
  isFetchingContact: boolean,
  receiveContactModalSettings: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
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
    if(!isContactFormValid) {return;}
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
    if(!isContactFormValid) {return;}
    contact.isSelected = true;
    createContact(contact);
  }

  render () {
    const {
      contactModalSettings,
      handleSubmit,
      isContactModalOpen,
      isFetchingContact,
    } = this.props;

    const {
      tenantsData,
    } = this.state;
    const tenants = get(tenantsData, 'tenants', []),
      tenantsArchived = get(tenantsData, 'tenantsArchived', []);

    return (
      <div>
        {isFetchingContact &&
          <LoaderWrapper className='overlay-wrapper'>
            <Loader isLoading={isFetchingContact} />
          </LoaderWrapper>
        }

        <ContactModal
          isOpen={isContactModalOpen}
          onCancel={this.handleCancel}
          onClose={this.handleClose}
          onSave={this.handleSave}
          onSaveAndAdd={this.handleSaveAndAdd}
          showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
          title={get(contactModalSettings, 'isNew') ? 'Uusi asiakas' : 'Muokkaa asiakasta'}
        />
        <form onSubmit={handleSubmit}>
          <h2>Vuokralaiset</h2>
          <Divider />

          <FormSection>
            <FieldArray
              component={renderTenants}
              name="tenants.tenants"
              showAddButton={true}
              tenants={tenants}
            />
            {/* Archived tenants */}
            <FieldArray
              component={renderTenants}
              name="tenants.tenantsArchived"
              showAddButton={false}
              tenants={tenantsArchived}
            />
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
        isContactFormValid: getIsContactFormValid(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
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
  }),
)(TenantsEdit);
