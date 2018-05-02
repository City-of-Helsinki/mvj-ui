// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import flowRight from 'lodash/flowRight';

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
  getContactFormTouched,
  getCurrentContact,
  getIsContactFormValid,
  getIsEditMode,
  getIsFetching,
} from '../selectors';
import {getContactFullName} from '../helpers';

import type {RootState} from '$src/root/types';
import type {Contact} from '../types';

type Props = {
  contact: Contact,
  contactFormValues: Contact,
  editContact: Function,
  fetchAttributes: Function,
  fetchSingleContact: Function,
  hideEditMode: Function,
  initializeContactForm: Function,
  isContactFormTouched: boolean,
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

class ContactPage extends Component {
  props: Props

  state: State = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
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
    fetchAttributes();
    fetchSingleContact(contactId);
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
    const {contact, isContactFormTouched, isContactFormValid, isEditMode, isFetching} = this.props;
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
              onCancelClick={isContactFormTouched ? () => this.setState({isCancelModalOpen: true}) : this.hideEditMode}
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
    contact: getCurrentContact(state),
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormTouched: getContactFormTouched(state),
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
