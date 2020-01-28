// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import {change, getFormValues, initialize, destroy, isDirty} from 'redux-form';

import Loader from '$components/loader/Loader';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import FullWidthContainer from '$components/content/FullWidthContainer';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import Tabs from '$components/tabs/Tabs';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {ConfirmationModalTexts} from '$src/enums';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getIsEditMode,
  getCurrentProperty,
  getIsSaveClicked,
  getIsFormValidById,
  getIsFormValidFlags,
} from '$src/property/selectors';
import {
  editProperty,
  hideEditMode,
  showEditMode,
  clearFormValidFlags,
  fetchSingleProperty,
  receiveIsSaveClicked,
  receiveSingleProperty,
  receiveFormValidFlags,
} from '$src/property/actions';
import {FormNames} from '$src/enums';
import {
  getUrlParams,
  getSearchQuery,
  setPageTitle,
  scrollToTopPage,
} from '$util/helpers';

import type {Attributes} from '$src/types';
import type {Property} from '$src/property/types';
import {
  getContentBasicInformation,
  getContentApplication,
  clearUnsavedChanges,
} from '$src/property/helpers';

import PropertyInfo from './propertySections/propertyInfo/PropertyInfo';
import BasicInfo from './propertySections/basicInfo/BasicInfo';
import BasicInfoEdit from './propertySections/basicInfo/BasicInfoEdit';
import Application from './propertySections/application/Application';
import ApplicationEdit from './propertySections/application/ApplicationEdit';
import {withPropertyAttributes} from '$components/attributes/PropertyAttributes';

type Props = {
  applicationFormValues: Object,
  basicInformationFormValues: Object,
  currentProperty: Property,
  clearFormValidFlags: Function,
  change: Function,
  destroy: Function,
  editProperty: Function,
  fetchSingleProperty: Function,
  hideEditMode: Function,
  history: Object,
  initialize: Function,
  isBasicInformationFormDirty: boolean,
  isBasicInformationFormValid: boolean,
  isApplicationFormDirty: boolean,
  isApplicationFormValid: boolean,
  isEditMode: boolean,
  isFetchingPropertyAttributes: boolean,
  isSaveClicked: boolean,
  isFetchingUsersPermissions: boolean,
  isFormValidFlags: boolean,
  location: Object,
  match: {
    params: Object,
  },
  propertyAttributes: Attributes,
  receiveTopNavigationSettings: Function,
  receiveIsSaveClicked: Function,
  showEditMode: Function,
  usersPermissions: UsersPermissionsType,
  receiveSingleProperty: Function,
  receiveFormValidFlags: Function,
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
}

class PropertyPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  timerAutoSave: any

  componentDidMount() {
    const {
      clearFormValidFlags,
      receiveTopNavigationSettings,
      fetchSingleProperty,
      match: {params: {propertyId}},
      location: {search},
      receiveIsSaveClicked,
      hideEditMode,
    } = this.props;
    
    const query = getUrlParams(search);

    setPageTitle('Kruununvuorenrannan kortteleiden 49288 ja 49289 laatu- ja hintakilpailu');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PROPERTY),
      pageTitle: 'Tonttihaut',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    fetchSingleProperty(propertyId);

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    hideEditMode();

    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {
      currentProperty,
      location: {search},
      isEditMode,
      match: {params: {propertyId}},
    } = this.props;
    const {activeTab} = this.state;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;

    
    if(tab != activeTab) {
      this.setState({activeTab: tab});
    }
    
    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    if(isEmpty(prevProps.currentProperty) && !isEmpty(currentProperty)) {
      const storedPropertyId = getSessionStorageItem('propertyId');

      if(Number(propertyId) === storedPropertyId) {
        this.setState({isRestoreModalOpen: true});
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }


  componentWillUnmount() {
    const {
      hideEditMode,
      location: {pathname},
      match: {params: {propertyId}},
      receiveSingleProperty,
    } = this.props;

    if(pathname !== `${getRouteById(Routes.PROPERTY)}/${propertyId}`) {
      // clearUnsavedChanges(); // TODO:
    }

    // Clear current
    receiveSingleProperty({});

    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    const {location: {search}} = this.props;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;

    // Set correct active tab on back/forward button press
    this.setState({activeTab: tab});
  }

  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  }

  handleLeavePage = (e) => {
    const {isEditMode} = this.props;

    if(this.isAnyFormDirty() && isEditMode) {
      const confirmationMessage = '';

      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  isAnyFormDirty = () => {
    const {
      isBasicInformationFormDirty,
    } = this.props;

    return (
      isBasicInformationFormDirty
    );
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  handleShowEditMode = () => {
    const {clearFormValidFlags, currentProperty, receiveIsSaveClicked, showEditMode} = this.props;

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentProperty);
    this.startAutoSaveTimer();
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  initializeForms = (property: Property) => {
    const {initialize} = this.props;
    initialize(FormNames.PROPERTY_BASIC_INFORMATION, getContentBasicInformation(property));
    initialize(FormNames.PROPERTY_APPLICATION, getContentApplication(property));
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.PROPERTY_BASIC_INFORMATION);
    destroy(FormNames.PROPERTY_APPLICATION);
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

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    // Remove page specific url parameters when moving to lease list page
    delete query.tab;
    delete query.lease_area;
    delete query.plan_unit;
    delete query.plot;
    delete query.opened_invoice;


    return history.push({
      pathname: `${getRouteById(Routes.PROPERTY)}`,
      search: getSearchQuery(query),
    });
  }

  saveChanges = () => {
    const {receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.getAreFormsValid();

    if(areFormsValid) {
      const {
        applicationFormValues,
        basicInformationFormValues,
        currentProperty,
        editProperty,
        isBasicInformationFormDirty,
        isApplicationFormDirty,
      } = this.props;
    
      //TODO: Add helper functions to save land use contract to DB when API is ready
      let payload: Object = {...currentProperty};

      if(isBasicInformationFormDirty) {
        payload = {...payload, ...basicInformationFormValues};
      }
      
      if(isApplicationFormDirty) {
        payload = {...payload, application_base: {...applicationFormValues}};
      }

      payload.identifier = currentProperty.identifier;
      editProperty(payload);
    }
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;

    this.setState({
      [modalVisibilityKey]: false,
    });
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;

    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  saveUnsavedChanges = () => {
    const {
      applicationFormValues,
      basicInformationFormValues,
      isBasicInformationFormDirty,
      isApplicationFormDirty,
      isFormValidFlags,
      match: {params: {propertyId}},
    } = this.props;
    
    let isDirty = false;

    if(isBasicInformationFormDirty) {
      setSessionStorageItem(FormNames.PROPERTY_BASIC_INFORMATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PROPERTY_BASIC_INFORMATION);
    }

    if(isApplicationFormDirty) {
      setSessionStorageItem(FormNames.PROPERTY_APPLICATION, applicationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PROPERTY_APPLICATION);
    }

    if(isDirty) {
      setSessionStorageItem('propertyId', propertyId);
      setSessionStorageItem('propertyValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('propertyId');
      removeSessionStorageItem('propertyValidity');
    }
  }

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.hideModal('Restore');
  }

  restoreUnsavedChanges = () => {
    const {
      clearFormValidFlags,
      currentProperty,
      receiveFormValidFlags,
      showEditMode,
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentProperty);

    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.PROPERTY_BASIC_INFORMATION);
    if(storedBasicInformationFormValues) {
      this.bulkChange(FormNames.PROPERTY_BASIC_INFORMATION, storedBasicInformationFormValues);
    }

    const storedApplicationFormValues = getSessionStorageItem(FormNames.PROPERTY_APPLICATION);
    if(storedApplicationFormValues) {
      this.bulkChange(FormNames.PROPERTY_APPLICATION, storedApplicationFormValues);
    }

    const storedFormValidity = getSessionStorageItem('propertyValidity');
    if(storedFormValidity) {
      receiveFormValidFlags(storedFormValidity);
    }

    this.startAutoSaveTimer();
    this.hideModal('Restore');
  }

  bulkChange = (formName: string, obj: Object) => {
    const {change} = this.props;
    const fields = Object.keys(obj);

    fields.forEach(field => {
      change(formName, field, obj[field]);
    });
  }

  getAreFormsValid = () => {
    const {
      isBasicInformationFormValid,
      isApplicationFormValid,
    } = this.props;

    return (
      isBasicInformationFormValid && 
      isApplicationFormValid
    );
  }

  render() {
    const {
      activeTab,
      isRestoreModalOpen,
    } = this.state;
    const {
      isEditMode,
      propertyAttributes,
      isFetchingPropertyAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
      isBasicInformationFormDirty,
      isBasicInformationFormValid,
      isApplicationFormDirty,
      isApplicationFormValid,
      isSaveClicked,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if(isFetchingPropertyAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!propertyAttributes || isEmpty(usersPermissions)) return null;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowEdit={true}
                isCancelDisabled={false}
                isCopyDisabled={true}
                isEditDisabled={false}
                isEditMode={isEditMode}
                isSaveDisabled={isSaveClicked && !areFormsValid}
                onCancel={this.cancelChanges}
                onEdit={this.handleShowEditMode}
                onSave={this.saveChanges}
                showCommentButton={false}
                showCopyButton={false}
              />
            }
            infoComponent={<PropertyInfo/>}
            onBack={this.handleBack}
          />

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Perustiedot',
                allow: true, // TODO
                isDirty: isBasicInformationFormDirty,
                hasError: isSaveClicked && !isBasicInformationFormValid,
              },
              {
                label: 'Hakemuslomake',
                allow: true, // TODO
                isDirty: isApplicationFormDirty,
                hasError: isSaveClicked && !isApplicationFormValid,
              },
              {
                label: 'Kartta',
                allow: true, // TODO
              },
              {
                label: 'Muutoshistoria',
                allow: true, // TODO
              },
            ]}
            onTabClick={this.handleTabClick}
          />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <ConfirmationModal
            confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON}
            isOpen={isRestoreModalOpen}
            label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL}
            onCancel={this.cancelRestoreUnsavedChanges}
            onClose={this.cancelRestoreUnsavedChanges}
            onSave={this.restoreUnsavedChanges}
            title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE}
          />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <BasicInfoEdit />
                  : <BasicInfo />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <ApplicationEdit />
                  : <Application />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {/* <SingleLeaseMap /> */}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {/* <LeaseAuditLog leaseId={leaseId}/> */}
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}


export default flowRight(
  withRouter,
  withPropertyAttributes,
  connect(
    (state) => {
      return {
        basicInformationFormValues: getFormValues(FormNames.PROPERTY_BASIC_INFORMATION)(state),
        isBasicInformationFormDirty: isDirty(FormNames.PROPERTY_BASIC_INFORMATION)(state),
        isBasicInformationFormValid: getIsFormValidById(state, FormNames.PROPERTY_BASIC_INFORMATION),
        applicationFormValues: getFormValues(FormNames.PROPERTY_APPLICATION)(state),
        isApplicationFormDirty: isDirty(FormNames.PROPERTY_APPLICATION)(state),
        isApplicationFormValid: getIsFormValidById(state, FormNames.PROPERTY_APPLICATION),
        currentProperty: getCurrentProperty(state),
        isEditMode: getIsEditMode(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        isSaveClicked: getIsSaveClicked(state),
        usersPermissions: getUsersPermissions(state),
        isFormValidFlags: getIsFormValidFlags(state),
      };
    },
    {
      change,
      hideEditMode,
      editProperty,
      initialize,
      destroy,
      receiveTopNavigationSettings,
      clearFormValidFlags,
      receiveIsSaveClicked,
      showEditMode,
      fetchSingleProperty,
      receiveSingleProperty,
      receiveFormValidFlags,
    }
  ),
)(PropertyPage);
