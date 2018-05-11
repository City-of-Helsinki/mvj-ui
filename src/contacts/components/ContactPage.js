// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactEdit from './ContactEdit';
import ContactReadonly from './ContactReadonly';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {
  editContact,
  fetchAttributes,
  fetchSingleContact,
  hideEditMode,
  initializeContactForm,
  showEditMode,
} from '$src/contacts/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/contacts/enums';
import {clearUnsavedChanges, getContactFullName} from '$src/contacts/helpers';
import {getRouteById} from '$src/root/routes';
import {
  getAttributes,
  getCurrentContact,
  getIsContactFormValid,
  getIsEditMode,
  getIsFetching,
} from '$src/contacts/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';


import type {RootState} from '$src/root/types';
import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  change: Function,
  contact: Contact,
  contactFormValues: Contact,
  editContact: Function,
  fetchAttributes: Function,
  fetchSingleContact: Function,
  hideEditMode: Function,
  initializeContactForm: Function,
  isContactFormDirty: boolean,
  isContactFormValid: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  location: Object,
  params: Object,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

type State = {
  isCancelModalOpen: boolean,
  isRestoreModalOpen: boolean,
}

class ContactPage extends Component<Props, State> {
  state = {
    isCancelModalOpen: false,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentWillMount() {
    const {
      attributes,
      fetchAttributes,
      fetchSingleContact,
      params: {contactId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    fetchSingleContact(contactId);

    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps) {
    const {params: {contactId}} = this.props;
    if(isEmpty(prevProps.contact) && !isEmpty(this.props.contact)) {
      const storedContactId = getSessionStorageItem('contactId');
      if(Number(contactId) === Number(storedContactId)) {
        this.setState({isRestoreModalOpen: true});
      }
    }
    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !this.props.isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    window.removeEventListener('beforeunload', this.handleLeavePage);
    this.stopAutoSaveTimer();
    clearUnsavedChanges();
    hideEditMode();
  }

  handleLeavePage = (e) => {
    const {isEditMode, isContactFormDirty} = this.props;
    if(isContactFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  }

  saveUnsavedChanges = () => {
    const {
      contactFormValues,
      isContactFormDirty,
      params: {contactId},
    } = this.props;

    if(isContactFormDirty) {
      setSessionStorageItem(FormNames.CONTACT, contactFormValues);
      setSessionStorageItem('contactId', contactId);
    } else {
      removeSessionStorageItem(FormNames.CONTACT);
      removeSessionStorageItem('contactId');
    }
  };

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({isRestoreModalOpen: false});
  }

  restoreUnsavedChanges = () => {
    const {contact, initializeContactForm, showEditMode} = this.props;

    showEditMode();
    initializeContactForm(contact);

    setTimeout(() => {
      const storedContactFormValues = getSessionStorageItem(FormNames.CONTACT);
      if(storedContactFormValues) {
        this.bulkChange(FormNames.CONTACT, storedContactFormValues);
      }

      this.startAutoSaveTimer();
    }, 20);

    this.setState({isRestoreModalOpen: false});
  }

  bulkChange = (formName: string, obj: Object) => {
    const {change} = this.props;
    const fields = Object.keys(obj);
    fields.forEach(field => {
      change(formName, field, obj[field]);
    });
  }

  copyContact = () => {
    const {contact, hideEditMode, initializeContactForm, router} = this.props;
    const {router: {location: {query}}} = this.props;

    contact.id = undefined;
    initializeContactForm(contact);
    hideEditMode();
    clearUnsavedChanges();

    return router.push({
      pathname: getRouteById('newcontact'),
      query,
    });
  }

  saveContact = () => {
    const {contactFormValues, editContact} = this.props;
    editContact(contactFormValues);
  }

  hideEditMode = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('contacts')}`,
      query,
    });
  }

  handleCancel = () => {
    const {hideEditMode} = this.props;

    this.setState({isCancelModalOpen: false});
    hideEditMode();
  }

  showEditMode = () => {
    const {
      contact,
      initializeContactForm,
      showEditMode,
    } = this.props;
    initializeContactForm(contact);
    showEditMode();
    this.startAutoSaveTimer();
  }

  render() {
    const {contact, isContactFormDirty, isContactFormValid, isEditMode, isFetching} = this.props;
    const {isCancelModalOpen, isRestoreModalOpen} = this.state;

    const nameInfo = getContactFullName(contact);

    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={() => this.setState({isCancelModalOpen: false})}
          onClose={() => this.setState({isCancelModalOpen: false})}
          onSave={this.handleCancel}
          title='Hylkää muutokset'
        />

        <ConfirmationModal
          confirmButtonLabel='Palauta muutokset'
          isOpen={isRestoreModalOpen}
          label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
          onCancel={this.cancelRestoreUnsavedChanges}
          onClose={this.restoreUnsavedChanges}
          onSave={this.restoreUnsavedChanges}
          title='Palauta tallentamattomat muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={!isContactFormValid}
              onCancelClick={isContactFormDirty ? () => this.setState({isCancelModalOpen: true}) : this.hideEditMode}
              onCopyClick={this.copyContact}
              onEditClick={this.showEditMode}
              onSaveClick={this.saveContact}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>{nameInfo}</h1>}
          onBack={this.handleBack}
        />
        {isEditMode
          ? <ContactEdit />
          : <ContactReadonly contact={contact} />
        }
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    contact: getCurrentContact(state),
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormDirty: isDirty(FormNames.CONTACT)(state),
    isContactFormValid: getIsContactFormValid(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      change,
      editContact,
      fetchAttributes,
      fetchSingleContact,
      hideEditMode,
      initializeContactForm,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(ContactPage);
