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
  receiveIsSaveClicked,
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
  getIsSaveClicked,
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
  isSaveClicked: boolean,
  location: Object,
  params: Object,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

type State = {
  isRestoreModalOpen: boolean,
}

class ContactPage extends Component<Props, State> {
  state = {
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentDidMount() {
    const {
      attributes,
      fetchAttributes,
      fetchSingleContact,
      hideEditMode,
      params: {contactId},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    fetchSingleContact(contactId);

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps) {
    const {params: {contactId}} = this.props;
    if(isEmpty(prevProps.contact) && !isEmpty(this.props.contact)) {
      const storedContactId = getSessionStorageItem('contactId');
      if(Number(contactId) === storedContactId) {
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
    const {
      hideEditMode,
      params: {contactId},
      router: {location: {pathname}},
    } = this.props;

    if(pathname !== `${getRouteById('contacts')}/${contactId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
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

  handleLeavePage = (e) => {
    const {isEditMode, isContactFormDirty} = this.props;

    if(isContactFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
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
      pathname: getRouteById('newContact'),
      query,
    });
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

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  saveChanges = () => {
    const {contactFormValues, editContact, isSaveClicked, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);

    if(isSaveClicked) {
      editContact(contactFormValues);
    }
  }

  showEditMode = () => {
    const {
      contact,
      initializeContactForm,
      receiveIsSaveClicked,
      showEditMode,
    } = this.props;

    receiveIsSaveClicked(false);
    initializeContactForm(contact);
    showEditMode();
    this.startAutoSaveTimer();
  }

  render() {
    const {contact, isContactFormValid, isEditMode, isFetching, isSaveClicked} = this.props;
    const {isRestoreModalOpen} = this.state;

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
          confirmButtonLabel='Palauta muutokset'
          isOpen={isRestoreModalOpen}
          label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
          onCancel={this.cancelRestoreUnsavedChanges}
          onClose={this.cancelRestoreUnsavedChanges}
          onSave={this.restoreUnsavedChanges}
          title='Palauta tallentamattomat muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !isContactFormValid}
              onCancel={this.cancelChanges}
              onCopy={this.copyContact}
              onEdit={this.showEditMode}
              onSave={this.saveChanges}
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
    isSaveClicked: getIsSaveClicked(state),
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
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(ContactPage);
