// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AuthorizationError from '$components/authorization/AuthorizationError';
import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import GreenBox from '$components/content/GreenBox';
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
import {ButtonColors} from '$components/enums';
import {ContactTypes, FormNames} from '$src/contacts/enums';
import {isEmptyValue} from '$util/helpers';
import {contactExists} from '$src/contacts/requestsAsync';
import {getRouteById, Routes} from '$src/root/routes';
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
  history: Object,
  isContactFormDirty: boolean,
  isContactFormValid: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes
  isSaveClicked: boolean,
  location: Object,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
}

class NewContactPage extends Component<Props> {
  componentDidMount() {
    const {receiveIsSaveClicked, receiveTopNavigationSettings, showEditMode} = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
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
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}`,
      search: search,
    });
  }

  cancelChanges = () => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
    });
  }

  createContact = () => {
    const {
      contactFormValues,
      createContact,
    } = this.props;

    createContact(contactFormValues);
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
      <AppConsumer>
        {({dispatch}) => {
          const handleCreate = async() => {
            const {contactFormValues, isContactFormValid, receiveIsSaveClicked} = this.props;
            const {business_id, national_identification_number, type} = contactFormValues;

            receiveIsSaveClicked(true);

            if(!isContactFormValid) return;

            const contactIdentifier = type
              ? type === ContactTypes.PERSON ? national_identification_number : business_id
              : null;

            if(contactIdentifier && !isEmptyValue(contactIdentifier)) {
              const exists = await contactExists(contactIdentifier);

              if(exists) {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    this.createContact();
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText: 'Luo asiakas',
                  confirmationModalLabel: <span>{`Tunnuksella ${contactIdentifier} on jo olemassa asiakas.`}<br />Haluatko luoda asiakkaan?</span>,
                  confirmationModalTitle: 'Luo asiakas',
                });

              } else {
                this.createContact();
              }
            } else {
              this.createContact();
            }
          };

          return(
            <FullWidthContainer>
              <ControlButtonBar
                buttonComponent={
                  <ControlButtons
                    allowEdit={contactMethods.POST}
                    isCopyDisabled={true}
                    isEditMode={true}
                    isSaveDisabled={isSaveClicked && !isContactFormValid}
                    onCancel={this.cancelChanges}
                    onSave={handleCreate}
                    showCommentButton={false}
                    showCopyButton={true}
                  />
                }
                infoComponent={<h1>Uusi asiakas</h1>}
                onBack={this.handleBack}
              />

              <PageContainer className='with-small-control-bar'>
                <ContentContainer>
                  <GreenBox className='no-margin'>
                    <ContactForm isFocusedOnMount/>
                  </GreenBox>
                </ContentContainer>
              </PageContainer>
            </FullWidthContainer>
          );
        }}
      </AppConsumer>

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
  withRouter,
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
