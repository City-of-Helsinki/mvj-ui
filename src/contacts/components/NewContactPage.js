// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import {
  createContact,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/contacts/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {FormNames} from '$src/contacts/enums';
import {getRouteById} from '$src/root/routes';
import {getIsContactFormValid, getIsSaveClicked} from '$src/contacts/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Methods} from '$src/types';
import type {RootState} from '$src/root/types';
import type {Contact} from '../types';

type Props = {
  contactFormValues: Contact,
  contactMethods: Methods, // get via withCommonAttributes HOC
  createContact: Function,
  hideEditMode: Function,
  isContactFormDirty: boolean,
  isContactFormValid: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

class NewContactPage extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {receiveIsSaveClicked, receiveTopNavigationSettings, showEditMode} = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    showEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    const {isContactFormDirty} = this.props;

    if(isContactFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
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
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('contacts'),
    });
  }

  saveChanges = () => {
    const {contactFormValues, createContact, isSaveClicked, receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    if(isSaveClicked) {
      createContact(contactFormValues);
    }
  }

  render() {
    const {
      contactMethods,
      isContactFormValid,
      isFetchingCommonAttributes,
      isSaveClicked,
    } = this.props;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!contactMethods.POST) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowEdit={contactMethods.POST}
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isContactFormValid}
              onCancel={this.cancelChanges}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi asiakas</h1>}
          onBack={this.handleBack}
        />

        <PageContainer className='with-small-control-bar'>
          <ContentContainer>
            <GreenBoxEdit className='no-margin'>
              <ContactForm isFocusedOnMount/>
            </GreenBoxEdit>
          </ContentContainer>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormDirty: isDirty(FormNames.CONTACT)(state),
    isContactFormValid: getIsContactFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default flowRight(
  withCommonAttributes,
  connect(
    mapStateToProps,
    {
      createContact,
      hideEditMode,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(NewContactPage);
