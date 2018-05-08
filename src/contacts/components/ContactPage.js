// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
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
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '../enums';
import {getRouteById} from '$src/root/routes';
import {
  getAttributes,
  getCurrentContact,
  getIsContactFormValid,
  getIsEditMode,
  getIsFetching,
} from '../selectors';
import {getContactFullName} from '../helpers';

import type {RootState} from '$src/root/types';
import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
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
}

class ContactPage extends Component<Props, State> {
  state = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

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

  copyContact = () => {
    const {contact, hideEditMode, initializeContactForm, router} = this.props;
    const {router: {location: {query}}} = this.props;
    contact.id = undefined;
    initializeContactForm(contact);
    hideEditMode();

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
  }

  render() {
    const {contact, isContactFormDirty, isContactFormValid, isEditMode, isFetching} = this.props;
    const {isCancelModalOpen} = this.state;

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
