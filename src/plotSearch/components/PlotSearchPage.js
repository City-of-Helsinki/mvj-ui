// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import {change, getFormValues, initialize, destroy, isDirty} from 'redux-form';

import {withUiDataList} from '$components/uiData/UiDataListHOC';
import AuthorizationError from '$components/authorization/AuthorizationError';
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
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import {
  getIsEditMode,
  getCurrentPlotSearch,
  getIsSaveClicked,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsFetching,
  getForm
} from '$src/plotSearch/selectors';
import {
  editPlotSearch,
  hideEditMode,
  showEditMode,
  clearFormValidFlags,
  fetchSinglePlotSearch,
  receiveIsSaveClicked,
  receiveSinglePlotSearch,
  receiveFormValidFlags,
  deletePlotSearch,
} from '$src/plotSearch/actions';
import {FormNames, ConfirmationModalTexts, Methods, PermissionMissingTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  getUrlParams,
  getSearchQuery,
  setPageTitle,
  scrollToTopPage,
  isMethodAllowed,
} from '$util/helpers';
import type {Attributes, Methods as MethodType} from '$src/types';
import type {PlotSearch, Form} from '$src/plotSearch/types';
import {
  getContentBasicInformation,
  getContentApplication,
  clearUnsavedChanges,
  cleanTargets,
} from '$src/plotSearch/helpers';

import PlotSearchInfo from './plotSearchSections/plotSearchInfo/PlotSearchInfo';
import BasicInfo from './plotSearchSections/basicInfo/BasicInfo';
import BasicInfoEdit from './plotSearchSections/basicInfo/BasicInfoEdit';
import Application from './plotSearchSections/application/Application';
import ApplicationEdit from './plotSearchSections/application/ApplicationEdit';
import ApplicationMap from './plotSearchSections/map/ApplicationMap';
import {withPlotSearchAttributes} from '$components/attributes/PlotSearchAttributes';
import {cleanDecisions} from "../helpers";

type Props = {
  applicationFormValues: Object,
  basicInformationFormValues: Object,
  currentPlotSearch: PlotSearch,
  clearFormValidFlags: Function,
  change: Function,
  destroy: Function,
  editPlotSearch: Function,
  fetchSinglePlotSearch: Function,
  hideEditMode: Function,
  history: Object,
  initialize: Function,
  isBasicInformationFormDirty: boolean,
  isBasicInformationFormValid: boolean,
  isApplicationFormDirty: boolean,
  isApplicationFormValid: boolean,
  isEditMode: boolean,
  isFetchingPlotSearchAttributes: boolean,
  isFetching: boolean,
  isSaveClicked: boolean,
  isFetchingUsersPermissions: boolean,
  isFormValidFlags: boolean,
  location: Object,
  match: {
    params: Object,
  },
  plotSearchAttributes: Attributes,
  receiveTopNavigationSettings: Function,
  receiveIsSaveClicked: Function,
  showEditMode: Function,
  usersPermissions: UsersPermissionsType,
  receiveSinglePlotSearch: Function,
  receiveFormValidFlags: Function,
  deletePlotSearch: Function,
  deletePlotSearch: Function,
  plotSearchMethods: MethodType,
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
}

class PlotSearchPage extends Component<Props, State> {
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
      fetchSinglePlotSearch,
      match: {params: {plotSearchId}},
      location: {search},
      receiveIsSaveClicked,
      hideEditMode,
    } = this.props;

    const query = getUrlParams(search);

    this.setPageTitle();

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_SEARCH),
      pageTitle: 'Tonttihaut',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    fetchSinglePlotSearch(plotSearchId);

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    hideEditMode();

    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {
      currentPlotSearch,
      location: {search},
      isEditMode,
      match: {params: {plotSearchId}},
    } = this.props;
    const {activeTab} = this.state;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;


    if(tab !== activeTab) {
      this.setState({activeTab: tab});
    }

    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    if(isEmpty(prevProps.currentPlotSearch) && !isEmpty(currentPlotSearch)) {
      const storedPlotSearchId = getSessionStorageItem('plotSearchId');

      if(Number(plotSearchId) === storedPlotSearchId) {
        this.setState({isRestoreModalOpen: true});
      }

      this.setPageTitle(currentPlotSearch.name);
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
      match: {params: {plotSearchId}},
      receiveSinglePlotSearch,
    } = this.props;

    if(pathname !== `${getRouteById(Routes.PLOT_SEARCH)}/${plotSearchId}`) {
      clearUnsavedChanges();
    }

    // Clear current
    receiveSinglePlotSearch({});

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

  setPageTitle = (name) => {
    setPageTitle(`${name ? `${name} | ` : ''}Tonttihaku`)
  };

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
    const {clearFormValidFlags, currentPlotSearch, receiveIsSaveClicked, showEditMode, plotSearchForm} = this.props;

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentPlotSearch, plotSearchForm);
    this.startAutoSaveTimer();
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  initializeForms = (plotSearch: PlotSearch, plotSearchForm: Form) => {
    const {initialize} = this.props;
    initialize(FormNames.PLOT_SEARCH_BASIC_INFORMATION, getContentBasicInformation(plotSearch));
    initialize(FormNames.PLOT_SEARCH_APPLICATION, getContentApplication(plotSearch, plotSearchForm));
    initialize(FormNames.PLOT_SEARCH_APPLICATION_PREVIEW_MOCK_FORM, {});
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
    destroy(FormNames.PLOT_SEARCH_APPLICATION);
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
      pathname: `${getRouteById(Routes.PLOT_SEARCH)}`,
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
        currentPlotSearch,
        editPlotSearch,
        isBasicInformationFormDirty,
        isApplicationFormDirty,
      } = this.props;

      //TODO: Add helper functions to save plotSearch to DB when API is ready
      let payload: Object = {...currentPlotSearch};

      // TODO: Temporary fix, bug can't save when no basic invormation values are dirty
      if(isBasicInformationFormDirty || !isBasicInformationFormDirty) {
        payload = {...payload, ...basicInformationFormValues};
      }
      if(isApplicationFormDirty || !!currentPlotSearch.form) {
        payload = {...payload, form: applicationFormValues.form.id};
      }
      payload = cleanTargets(payload);
      payload = cleanDecisions(payload);
      payload.identifier = currentPlotSearch.identifier;
      editPlotSearch(payload);
      this.setPageTitle(basicInformationFormValues.name);
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
      match: {params: {plotSearchId}},
    } = this.props;

    let isDirty = false;

    if(isBasicInformationFormDirty) {
      setSessionStorageItem(FormNames.PLOT_SEARCH_BASIC_INFORMATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
    }

    if(isApplicationFormDirty) {
      setSessionStorageItem(FormNames.PLOT_SEARCH_APPLICATION, applicationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PLOT_SEARCH_APPLICATION);
    }

    if(isDirty) {
      setSessionStorageItem('plotSearchId', plotSearchId);
      setSessionStorageItem('plotSearchValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('plotSearchId');
      removeSessionStorageItem('plotSearchValidity');
    }
  }

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.hideModal('Restore');
  }

  restoreUnsavedChanges = () => {
    const {
      clearFormValidFlags,
      currentPlotSearch,
      receiveFormValidFlags,
      showEditMode,
      plotSearchForm
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentPlotSearch, plotSearchForm);

    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
    if(storedBasicInformationFormValues) {
      this.bulkChange(FormNames.PLOT_SEARCH_BASIC_INFORMATION, storedBasicInformationFormValues);
    }

    const storedApplicationFormValues = getSessionStorageItem(FormNames.PLOT_SEARCH_APPLICATION);
    if(storedApplicationFormValues) {
      this.bulkChange(FormNames.PLOT_SEARCH_APPLICATION, storedApplicationFormValues);
    }

    const storedFormValidity = getSessionStorageItem('plotSearchValidity');
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

  handleDelete = () => {
    const {
      deletePlotSearch,
      match: {params: {plotSearchId}},
    } = this.props;

    deletePlotSearch(plotSearchId);
  }

  render() {
    const {
      activeTab,
      isRestoreModalOpen,
    } = this.state;
    const {
      isEditMode,
      plotSearchAttributes,
      isFetchingPlotSearchAttributes,
      isFetching,
      usersPermissions,
      isFetchingUsersPermissions,
      isBasicInformationFormDirty,
      isBasicInformationFormValid,
      isApplicationFormDirty,
      isApplicationFormValid,
      isSaveClicked,
      currentPlotSearch,
      plotSearchMethods,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if(isFetchingPlotSearchAttributes || isFetchingUsersPermissions || isFetching) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!plotSearchAttributes || isEmpty(usersPermissions)) return null;

    if(!plotSearchMethods) return null;

    if(!isMethodAllowed(plotSearchMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowDelete={isMethodAllowed(plotSearchMethods, Methods.DELETE)}
                allowEdit={isMethodAllowed(plotSearchMethods, Methods.PATCH)}
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
                onDelete={this.handleDelete}
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: ConfirmationModalTexts.DELETE_PLOT_SEARCH.BUTTON,
                  label: ConfirmationModalTexts.DELETE_PLOT_SEARCH.LABEL,
                  title: ConfirmationModalTexts.DELETE_PLOT_SEARCH.TITLE,
                }}
              />
            }
            infoComponent={<PlotSearchInfo title={currentPlotSearch.name}/>}
            onBack={this.handleBack}
          />
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Perustiedot',
                allow: true,
                isDirty: isBasicInformationFormDirty,
                hasError: isSaveClicked && !isBasicInformationFormValid,
              },
              {
                label: 'Hakemuslomake',
                allow: true,
                isDirty: isApplicationFormDirty,
                hasError: isSaveClicked && !isApplicationFormValid,
              },
              {
                label: 'Kartta',
                allow: true,
              },
              {
                label: 'Muutoshistoria',
                allow: true,
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
                <ApplicationMap />
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
  withPlotSearchAttributes,
  withUiDataList,
  connect(
    (state) => {
      return {
        basicInformationFormValues: getFormValues(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(state),
        isBasicInformationFormDirty: isDirty(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(state),
        isBasicInformationFormValid: getIsFormValidById(state, FormNames.PLOT_SEARCH_BASIC_INFORMATION),
        applicationFormValues: getFormValues(FormNames.PLOT_SEARCH_APPLICATION)(state),
        isApplicationFormDirty: isDirty(FormNames.PLOT_SEARCH_APPLICATION)(state),
        isApplicationFormValid: getIsFormValidById(state, FormNames.PLOT_SEARCH_APPLICATION),
        currentPlotSearch: getCurrentPlotSearch(state),
        isEditMode: getIsEditMode(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        usersPermissions: getUsersPermissions(state),
        isFormValidFlags: getIsFormValidFlags(state),
        plotSearchForm: getForm(state)
      };
    },
    {
      change,
      hideEditMode,
      editPlotSearch,
      initialize,
      destroy,
      receiveTopNavigationSettings,
      clearFormValidFlags,
      receiveIsSaveClicked,
      showEditMode,
      fetchSinglePlotSearch,
      receiveSinglePlotSearch,
      receiveFormValidFlags,
      deletePlotSearch,
    }
  ),
)(PlotSearchPage);
