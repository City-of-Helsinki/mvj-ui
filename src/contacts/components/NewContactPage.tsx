import React, { Component } from "react";
import { connect } from "react-redux";
import { getFormValues, isDirty } from "redux-form";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import AuthorizationError from "src/components/authorization/AuthorizationError";
import ContactForm from "./forms/ContactForm";
import ContentContainer from "src/components/content/ContentContainer";
import ControlButtonBar from "src/components/controlButtons/ControlButtonBar";
import ControlButtons from "src/components/controlButtons/ControlButtons";
import FullWidthContainer from "src/components/content/FullWidthContainer";
import GreenBox from "src/components/content/GreenBox";
import Loader from "src/components/loader/Loader";
import PageContainer from "src/components/content/PageContainer";
import PageNavigationWrapper from "src/components/content/PageNavigationWrapper";
import { createContact, hideEditMode, receiveIsSaveClicked, showEditMode } from "src/contacts/actions";
import { receiveTopNavigationSettings } from "src/components/topNavigation/actions";
import { ConfirmationModalTexts, FormNames, Methods, PermissionMissingTexts } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { ContactTypes } from "src/contacts/enums";
import { isEmptyValue, isMethodAllowed, setPageTitle } from "src/util/helpers";
import { contactExists } from "src/contacts/requestsAsync";
import { getRouteById, Routes } from "src/root/routes";
import { getIsContactFormValid, getIsSaveClicked } from "src/contacts/selectors";
import { withContactAttributes } from "src/components/attributes/ContactAttributes";
import { withUiDataList } from "src/components/uiData/UiDataListHOC";
import type { Methods as MethodsType } from "src/types";
import type { RootState } from "src/root/types";
import type { Contact } from "../types";
type Props = {
  contactFormValues: Contact;
  contactMethods: MethodsType;
  // get via withContactAttributes HOC
  createContact: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  isContactFormDirty: boolean;
  isContactFormValid: boolean;
  isFetchingContactAttributes: boolean;
  // get via withContactAttributes HOC
  isSaveClicked: boolean;
  location: Record<string, any>;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
};

class NewContactPage extends Component<Props> {
  componentDidMount() {
    const {
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode
    } = this.props;
    setPageTitle('Uusi asiakas');
    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
      pageTitle: 'Asiakkaat',
      showSearch: false
    });
    showEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {
      hideEditMode
    } = this.props;
    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = e => {
    const {
      isContactFormDirty
    } = this.props;

    if (isContactFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };
  handleBack = () => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}`,
      search: search
    });
  };
  cancelChanges = () => {
    const {
      history
    } = this.props;
    return history.push({
      pathname: getRouteById(Routes.CONTACTS)
    });
  };
  createContact = () => {
    const {
      contactFormValues,
      createContact
    } = this.props;
    createContact(contactFormValues);
  };

  render() {
    const {
      contactMethods,
      isContactFormValid,
      isFetchingContactAttributes,
      isSaveClicked
    } = this.props;
    if (isFetchingContactAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!contactMethods) return null;
    if (!isMethodAllowed(contactMethods, Methods.POST)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleCreate = async () => {
          const {
            contactFormValues,
            isContactFormValid,
            receiveIsSaveClicked
          } = this.props;
          const {
            business_id,
            national_identification_number,
            type
          } = contactFormValues;
          receiveIsSaveClicked(true);
          if (!isContactFormValid) return;
          const contactIdentifier = type ? type === ContactTypes.PERSON ? national_identification_number : business_id : null;

          if (contactIdentifier && !isEmptyValue(contactIdentifier)) {
            const exists = await contactExists(contactIdentifier);

            if (exists) {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  this.createContact();
                },
                confirmationModalButtonClassName: ButtonColors.SUCCESS,
                confirmationModalButtonText: ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.CREATE_CONTACT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.CREATE_CONTACT.TITLE
              });
            } else {
              this.createContact();
            }
          } else {
            this.createContact();
          }
        };

        return <FullWidthContainer>
              <PageNavigationWrapper>
                <ControlButtonBar buttonComponent={<ControlButtons allowEdit={isMethodAllowed(contactMethods, Methods.POST)} isCopyDisabled={true} isEditMode={true} isSaveDisabled={isSaveClicked && !isContactFormValid} onCancel={this.cancelChanges} onSave={handleCreate} showCommentButton={false} showCopyButton={true} />} infoComponent={<h1>Uusi asiakas</h1>} onBack={this.handleBack} />
              </PageNavigationWrapper>

              <PageContainer className='with-small-control-bar'>
                <ContentContainer>
                  <GreenBox className='no-margin'>
                    <ContactForm isFocusedOnMount />
                  </GreenBox>
                </ContentContainer>
              </PageContainer>
            </FullWidthContainer>;
      }}
      </AppConsumer>;
  }

}

const mapStateToProps = (state: RootState) => {
  return {
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormDirty: isDirty(FormNames.CONTACT)(state),
    isContactFormValid: getIsContactFormValid(state),
    isSaveClicked: getIsSaveClicked(state)
  };
};

export default flowRight(withContactAttributes, withUiDataList, withRouter, connect(mapStateToProps, {
  createContact,
  hideEditMode,
  receiveIsSaveClicked,
  receiveTopNavigationSettings,
  showEditMode
}))(NewContactPage);