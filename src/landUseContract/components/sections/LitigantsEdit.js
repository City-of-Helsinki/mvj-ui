// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactModal from '$src/contacts/components/ContactModal';
import FormSection from '$components/form/FormSection';
import LitigantItemEdit from './LitigantItemEdit';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {
  createContactOnModal as createContact,
  editContactOnModal as editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveIsSaveClicked,
} from '$src/contacts/actions';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames as ContactFormNames} from '$src/contacts/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getContentContact} from '$src/contacts/helpers';
import {getContentLitigants} from '$src/landUseContract/helpers';
import {
  getContactModalSettings,
  getIsContactFormValid,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from '$src/contacts/selectors';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {ContactModalSettings} from '$src/contacts/types';
import type {LandUseContract} from '$src/landUseContract/types';

type LitigantsProps = {
  fields: any,
  litigants: Array<Object>,
  onOpenDeleteModal: Function,
  showAddButton: boolean,
}

const renderLitigants = ({
  fields,
  litigants,
  onOpenDeleteModal,
  showAddButton,
}: LitigantsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  const handleOpenDeleteModal = (index: number) => {
    onOpenDeleteModal(
      () => fields.remove(index),
      DeleteModalTitles.LITIGANT,
      DeleteModalLabels.LITIGANT,
    );
  };

  return (
    <div>
      {!showAddButton && fields && !!fields.length &&
        <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
      }
      {fields && !!fields.length && fields.map((litigant, index) => {
        return (
          <LitigantItemEdit
            key={index}
            field={litigant}
            index={index}
            litigants={litigants}
            onOpenDeleteModal={onOpenDeleteModal}
            onRemove={handleOpenDeleteModal}
          />
        );
      })}
      {showAddButton &&
        <Row>
          <Column>
            <AddButton
              className='no-margin'
              label='Lisää osapuoli'
              onClick={handleAdd}
              title='Lisää osapuoli'
            />
          </Column>
        </Row>
      }
    </div>
  );
};

type Props = {
  change: Function,
  contactModalSettings: ContactModalSettings,
  contactFormValues: Object,
  createContact: Function,
  currentLandUseContract: LandUseContract,
  editContact: Function,
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
  litigants: Array<Object>,
  currentLandUseContract: LandUseContract,
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
  litigants: Array<Object>,
}

class TenantsEdit extends Component<Props, State> {
  state = {
    currentLandUseContract: {},
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.LITIGANT,
    deleteModalTitle: DeleteModalTitles.LITIGANT,
    isDeleteModalOpen: false,
    litigants: [],
  }

  componentDidMount() {
    const {hideContactModal} = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLandUseContract !== state.currentLandUseContract) {
      return {
        currentLandUseContract: props.currentLandUseContract,
        litigants: getContentLitigants(props.currentLandUseContract),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {change, contactModalSettings, receiveContactModalSettings, receiveFormValidFlags} = this.props;
    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.LITIGANTS]: this.props.valid,
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

  handleSaveContact = () => {
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

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.LITIGANT, modalLabel: string = DeleteModalLabels.LITIGANT) => {
    this.setState({
      deleteFunction: fn,
      deleteModalLabel: modalLabel,
      deleteModalTitle: modalTitle,
      isDeleteModalOpen: true,
    });
  }

  handleHideDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  handleDeleteClick = () => {
    const {deleteFunction} = this.state;
    if(deleteFunction) {
      deleteFunction();
    }
    this.handleHideDeleteModal();
  }

  render () {
    const {
      contactModalSettings,
      isContactModalOpen,
      isFetchingContact,
    } = this.props;

    const {
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
      litigants,
    } = this.state;

    return (
      <div>
        {isFetchingContact &&
          <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>
        }

        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onCancel={this.handleCancel}
          onClose={this.handleClose}
          onSave={this.handleSaveContact}
          onSaveAndAdd={this.handleSaveAndAdd}
          showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
          title={get(contactModalSettings, 'isNew') ? 'Uusi asiakas' : 'Muokkaa asiakasta'}
        />
        <form>
          <FormSection>
            <FieldArray
              component={renderLitigants}
              litigants={litigants}
              name="activeLitigants"
              onOpenDeleteModal={this.handleOpenDeleteModal}
              showAddButton={true}
            />
            {/* Archived tenants */}
            <FieldArray
              component={renderLitigants}
              litigants={litigants}
              name="archivedLitigants"
              onOpenDeleteModal={this.handleOpenDeleteModal}
              showAddButton={false}
            />
          </FormSection>
        </form>
      </div>
    );
  }
}

const formName = FormNames.LITIGANTS;

export default flowRight(
  connect(
    (state) => {
      return {
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(ContactFormNames.CONTACT)(state),
        currentLandUseContract: getCurrentLandUseContract(state),
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
