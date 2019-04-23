// @flow
import React, {Fragment, Component} from 'react';
import {connect} from 'react-redux';
import {change, getFormValues, isDirty} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactAuditLog from './ContactAuditLog';
import ContactEdit from './ContactEdit';
import ContactReadonly from './ContactReadonly';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Divider from '$components/content/Divider';
import FullWidthContainer from '$components/content/FullWidthContainer';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import Title from '$components/content/Title';
import TradeRegisterTemplate from '$src/tradeRegister/components/TradeRegisterTemplate';
import {
  editContact,
  fetchSingleContact,
  hideEditMode,
  initializeContactForm,
  receiveIsSaveClicked,
  receiveSingleContact,
  showEditMode,
} from '$src/contacts/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {
  ContactFieldPaths,
  ContactFieldTitles,
  ContactTypes,
} from '$src/contacts/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {clearUnsavedChanges, getContactFullName} from '$src/contacts/helpers';
import {getUiDataContactKey} from '$src/uiData/helpers';
import {
  hasPermissions,
  getSearchQuery,
  getUrlParams,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {
  getCurrentContact,
  getIsContactFormValid,
  getIsEditMode,
  getIsFetching,
  getIsSaveClicked,
  getIsSaving,
} from '$src/contacts/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Methods as MethodsType} from '$src/types';
import type {RootState} from '$src/root/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import type {Contact} from '../types';

type Props = {
  change: Function,
  contact: Contact,
  contactFormValues: Contact,
  contactMethods: MethodsType, // get via withCommonAttributes HOC
  editContact: Function,
  fetchSingleContact: Function,
  hideEditMode: Function,
  history: Object,
  initializeContactForm: Function,
  isContactFormDirty: boolean,
  isContactFormValid: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  isSaveClicked: boolean,
  isSaving: boolean,
  location: Object,
  match: {
    params: Object,
  },
  receiveIsSaveClicked: Function,
  receiveSingleContact: Function,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
  usersPermissions: UsersPermissionsType, // via withCommonAttributes HOC
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
}

class ContactPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
  }

  timerAutoSave: any

  componentDidMount() {
    const {
      fetchSingleContact,
      hideEditMode,
      location: {search},
      match: {params: {contactId}},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    this.setPageTitle();

    receiveIsSaveClicked(false);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.CONTACTS),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });

    fetchSingleContact(contactId);

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {contact, match: {params: {contactId}}} = this.props;
    const {activeTab} = this.state;

    if(contact !== prevProps.contact) {
      this.setPageTitle();
    }

    if(isEmpty(prevProps.contact) && !isEmpty(contact)) {
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

    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }
  }

  setPageTitle = () => {
    const {contact} = this.props;
    const nameInfo = getContactFullName(contact);

    setPageTitle(`${nameInfo
      ? `${nameInfo} | `
      : ''}Asiakas`);
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      match: {params: {contactId}},
      location: {pathname},
      receiveSingleContact,
    } = this.props;

    if(pathname !== `${getRouteById(Routes.CONTACTS)}/${contactId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    // Clear current contact
    receiveSingleContact({});

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
      match: {params: {contactId}},
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
    const {contact, hideEditMode, initializeContactForm} = this.props;
    const {history, location: {search}} = this.props;

    contact.id = undefined;
    initializeContactForm(contact);
    hideEditMode();
    clearUnsavedChanges();

    return history.push({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: search,
    });
  }

  hideEditMode = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    // Remove page specific url parameters when moving to lease list page
    delete query.tab;

    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}`,
      search: getSearchQuery(query),
    });
  }

  handleTabClick = (tabId) => {
    const {history, location, location: {search}} = this.props;
    const query = getUrlParams(search);

    this.setState({activeTab: tabId}, () => {
      query.tab = tabId;

      return history.push({
        ...location,
        search: getSearchQuery(query),
      });
    });
  };

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  saveChanges = () => {
    const {contactFormValues, editContact, isContactFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);

    if(isContactFormValid) {
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
    const {
      contact,
      contactMethods,
      isContactFormDirty,
      isContactFormValid,
      isEditMode,
      isFetching,
      isFetchingCommonAttributes,
      isSaveClicked,
      isSaving,
      match: {params: {contactId}},
      usersPermissions,
    } = this.props;
    const {activeTab, isRestoreModalOpen} = this.state;

    const nameInfo = getContactFullName(contact);

    if(isFetching || isFetchingCommonAttributes) {
      return (
        <PageContainer><Loader isLoading={true} /></PageContainer>
      );
    }

    if(!contactMethods) return null;

    if(!isMethodAllowed(contactMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.CONTACT} /></PageContainer>;

    return (
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowCopy={isMethodAllowed(contactMethods, Methods.POST)}
                allowEdit={isMethodAllowed(contactMethods, Methods.PATCH)}
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
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Perustiedot',
                allow: true,
                isDirty: isContactFormDirty,
                hasError: isSaveClicked && !isContactFormValid,
              },
              {
                label: 'Kaupparekisteri',
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) && !!contact.business_id && contact.type !== ContactTypes.PERSON,
              },
              {
                label: 'Muutoshistoria',
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_CONTACT),
              },
            ]}
            onTabClick={this.handleTabClick}
          />
        </PageNavigationWrapper>
        <PageContainer className='with-small-control-bar-and-tabs' hasTabs>
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }
          <Authorization allow={isMethodAllowed(contactMethods, Methods.PATCH)}>
            <ConfirmationModal
              confirmButtonLabel='Palauta muutokset'
              isOpen={isRestoreModalOpen}
              label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
              onCancel={this.cancelRestoreUnsavedChanges}
              onClose={this.cancelRestoreUnsavedChanges}
              onSave={this.restoreUnsavedChanges}
              title='Palauta tallentamattomat muutokset'
            />
          </Authorization>

          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataContactKey(ContactFieldPaths.BASIC_INFO)}>
                  {ContactFieldTitles.BASIC_INFO}
                </Title>
                <Divider />
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(contactMethods, Methods.PATCH)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL}/>}
                  > <ContactEdit /></Authorization>
                  : <ContactReadonly contact={contact} />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Authorization
                  allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}
                  errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                >
                  {!!contact.business_id && contact.type !== ContactTypes.PERSON &&
                    <Fragment>
                      <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataContactKey(ContactFieldPaths.TRADE_REGISTER)}>
                        {ContactFieldTitles.TRADE_REGISTER}
                      </Title>
                      <Divider />
                      <TradeRegisterTemplate
                        businessId={contact.business_id}
                      />
                    </Fragment>
                  }
                </Authorization>
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Authorization
                  allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_CONTACT)}
                  errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                >
                  <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataContactKey(ContactFieldPaths.AUDIT_LOG)}>
                    {ContactFieldTitles.AUDIT_LOG}
                  </Title>
                  <Divider />
                  <ContactAuditLog contactId={contactId} />
                </Authorization>
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contact: getCurrentContact(state),
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    isContactFormDirty: isDirty(FormNames.CONTACT)(state),
    isContactFormValid: getIsContactFormValid(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state),
  };
};

export default flowRight(
  withCommonAttributes,
  withUiDataList,
  withRouter,
  connect(
    mapStateToProps,
    {
      change,
      editContact,
      fetchSingleContact,
      hideEditMode,
      initializeContactForm,
      receiveIsSaveClicked,
      receiveSingleContact,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(ContactPage);
