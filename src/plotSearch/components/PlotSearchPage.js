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
import {
  getIsEditMode,
  getCurrentPlotSearch,
  getIsSaveClicked,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsFetching,
  getForm,
  getIsFetchingAnyPlanUnits,
  getIsFetchingPlanUnitAttributes,
  areTargetsAllowedToHaveType,
  isLockedForModifications,
  isFetchingStages,
  getIsFetchingSubtypes,
  getIsFetchingRelatedApplications,
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
  fetchPlotSearchRelatedApplications,
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
import {
  getContentBasicInformation,
  getContentApplication,
  clearUnsavedChanges,
  cleanTargets,
  cleanDecisions,
} from '$src/plotSearch/helpers';
import PlotSearchInfo from '$src/plotSearch/components/plotSearchSections/plotSearchInfo/PlotSearchInfo';
import BasicInfo from '$src/plotSearch/components/plotSearchSections/basicInfo/BasicInfo';
import BasicInfoEdit from '$src/plotSearch/components/plotSearchSections/basicInfo/BasicInfoEdit';
import Application from '$src/plotSearch/components/plotSearchSections/application/Application';
import ApplicationEdit from '$src/plotSearch/components/plotSearchSections/application/ApplicationEdit';
import ApplicationMap from '$src/plotSearch/components/plotSearchSections/map/ApplicationMap';
import {withPlotSearchAttributes} from '$components/attributes/PlotSearchAttributes';
import {FIELDS_LOCKED_FOR_EDITING} from '$src/plotSearch/constants';
import PlotSearchExportModal from '$src/plotApplications/components/exportModal/PlotSearchExportModal';
import ReservationIdentifiersModal from '$src/plotSearch/components/reservationIdentifiers/ReservationIdentifiersModal';
import DirectReservationLinkModal from '$src/plotSearch/components/directReservationLinkModal/DirectReservationLinkModal';
import {fetchAttributes as fetchApplicationAttributes} from '$src/application/actions';
import {getIsFetchingAttributes as getIsFetchingApplicationAttributes} from '$src/application/selectors';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import type {Attributes, Methods as MethodType} from '$src/types';
import type {PlotSearch} from '$src/plotSearch/types';
import type {Form} from '$src/application/types';

type OwnProps = {|

|};

type Props = {
  ...OwnProps,
  applicationFormValues: Object,
  basicInformationFormValues: Object,
  currentPlotSearch: PlotSearch,
  plotSearchForm: Object,
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
  isFetchingAnyPlanUnits: boolean,
  isFetchingPlanUnitAttributes: boolean,
  isFetchingStages: boolean,
  isFetchingSubtypes: boolean,
  isFormValidFlags: boolean,
  isLockedForModifications: boolean,
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
  plotSearchMethods: MethodType,
  areTargetsAllowedToHaveType: boolean,
  fetchApplicationAttributes: Function,
  isFetchingApplicationAttributes: boolean,
  fetchPlotSearchRelatedApplications: Function,
  relatedApplications: Array<Object>,
  isFetchingRelatedApplications: boolean,
  applicationOpeningFormValues: Object,
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
  isExportModalOpen: boolean,
  isReservationIdentifiersModalOpen: boolean,
  isDirectReservationLinkModalOpen: boolean,
}

class PlotSearchPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
    isExportModalOpen: false,
    isReservationIdentifiersModalOpen: false,
    isDirectReservationLinkModalOpen: false,
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
      fetchApplicationAttributes,
      fetchPlotSearchRelatedApplications,
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
    fetchApplicationAttributes();
    fetchPlotSearchRelatedApplications(plotSearchId);

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    hideEditMode();

    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
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
    setPageTitle(`${name ? `${name} | ` : ''}Tonttihaku`);
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

  handleShowEditMode = (showOpeningSection: boolean) => {
    const {clearFormValidFlags, currentPlotSearch, receiveIsSaveClicked, showEditMode, plotSearchForm} = this.props;

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentPlotSearch, plotSearchForm, showOpeningSection);
    this.startAutoSaveTimer();
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  initializeForms = (plotSearch: PlotSearch, plotSearchForm: Form, showOpeningSection: boolean) => {
    const {initialize} = this.props;
    initialize(FormNames.PLOT_SEARCH_BASIC_INFORMATION, getContentBasicInformation(plotSearch));
    initialize(FormNames.PLOT_SEARCH_APPLICATION, getContentApplication(plotSearch, plotSearchForm));
    initialize(FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING, {
      section: {},
    });
    initialize(FormNames.PLOT_SEARCH_APPLICATION_PREVIEW_MOCK_FORM, {});
    initialize(FormNames.PLOT_SEARCH_APPLICATIONS_OPENING, {
      opening_record: showOpeningSection ? {
        openers: [],
        note: '',
      } : null,
    });
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.PLOT_SEARCH_BASIC_INFORMATION);
    destroy(FormNames.PLOT_SEARCH_APPLICATION);
    destroy(FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING);
    destroy(FormNames.PLOT_SEARCH_APPLICATION_PREVIEW_MOCK_FORM);
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
    const {
      receiveIsSaveClicked,
      applicationFormValues,
      basicInformationFormValues,
      currentPlotSearch,
      editPlotSearch,
      isBasicInformationFormDirty,
      isApplicationFormDirty,
      areTargetsAllowedToHaveType,
      isLockedForModifications,
      applicationOpeningFormValues,
    } = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.getAreFormsValid();

    if (areFormsValid) {
      //TODO: Add helper functions to save plotSearch to DB when API is ready
      let payload: Object = {
        basicInfo: {...currentPlotSearch},
        form: null,
      };

      if (isApplicationFormDirty || !!currentPlotSearch.form && applicationFormValues.form) {
        payload.form = {...applicationFormValues.form};
      }

      if (isBasicInformationFormDirty || payload.form && currentPlotSearch.form !== payload.form) {
        payload.basicInfo = {...payload.basicInfo, ...basicInformationFormValues};

        payload.basicInfo = cleanTargets(payload.basicInfo, !areTargetsAllowedToHaveType);
        payload.basicInfo = cleanDecisions(payload.basicInfo);
        payload.basicInfo.identifier = currentPlotSearch.identifier;
        payload.basicInfo.form = applicationFormValues.form?.id;

        if (isLockedForModifications) {
          FIELDS_LOCKED_FOR_EDITING.forEach((field) => delete payload.basicInfo[field]);
        }
      }

      if (applicationOpeningFormValues.opening_record !== null) {
        payload.openingRecord = {
          note: applicationOpeningFormValues.opening_record.note,
          openers: applicationOpeningFormValues.opening_record.openers.map((opener) => opener.id),
        };
      }

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
      plotSearchForm,
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentPlotSearch, plotSearchForm, false);

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
      isFetchingAnyPlanUnits,
      isFetchingPlanUnitAttributes,
      isFetchingStages,
      isFetchingSubtypes,
      isFetchingApplicationAttributes,
      isFetchingRelatedApplications,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if (
      isFetchingPlotSearchAttributes ||
      isFetchingUsersPermissions ||
      isFetching ||
      isFetchingSubtypes ||
      isFetchingStages ||
      isFetchingApplicationAttributes ||
      isFetchingRelatedApplications
    ) {
      return <PageContainer><Loader isLoading={true} /></PageContainer>;
    }

    if (!plotSearchAttributes || isEmpty(usersPermissions)) {
      return null;
    }

    if (!plotSearchMethods) {
      return null;
    }

    if (!isMethodAllowed(plotSearchMethods, Methods.GET)) {
      return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_SEARCH} /></PageContainer>;
    }

    const openExportModal = () => this.setState(() => ({
      isExportModalOpen: true,
    }));

    const openReservationIdentifiersModal = () => this.setState(() => ({
      isReservationIdentifiersModalOpen: true,
    }));

    const openDirectReservationLinkModal = () => this.setState(() => ({
      isDirectReservationLinkModalOpen: true,
    }));

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
                isEditDisabled={isFetchingAnyPlanUnits || isFetchingPlanUnitAttributes}
                isEditMode={isEditMode}
                isSaveDisabled={isSaveClicked && !areFormsValid}
                onCancel={this.cancelChanges}
                onEdit={() => this.handleShowEditMode(false)}
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
            isOpen={isRestoreModalOpen && !isFetchingAnyPlanUnits && !isFetchingPlanUnitAttributes}
            label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL}
            onCancel={this.cancelRestoreUnsavedChanges}
            onClose={this.cancelRestoreUnsavedChanges}
            onSave={this.restoreUnsavedChanges}
            title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE}
          />
          <DirectReservationLinkModal
            isOpen={this.state.isDirectReservationLinkModalOpen}
            onClose={() => this.setState(() => ({
              isDirectReservationLinkModalOpen: false,
            }))}
            targets={currentPlotSearch.plot_search_targets || null}
          />
          <PlotSearchExportModal
            isOpen={this.state.isExportModalOpen}
            onClose={() => this.setState(() => ({
              isExportModalOpen: false,
            }))}
            plotSearchId={currentPlotSearch.id || null}
          />
          <ReservationIdentifiersModal
            isOpen={this.state.isReservationIdentifiersModalOpen}
            onClose={() => this.setState(() => ({
              isReservationIdentifiersModalOpen: false,
            }))} />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <BasicInfoEdit />
                  : <BasicInfo
                    openExportModal={openExportModal}
                    openReservationIdentifiersModal={openReservationIdentifiersModal}
                    openDirectReservationLinkModal={openDirectReservationLinkModal}
                    showEditMode={this.handleShowEditMode}
                  />
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


export default (flowRight(
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
        plotSearchForm: getForm(state),
        isFetchingAnyPlanUnits: getIsFetchingAnyPlanUnits(state),
        isFetchingPlanUnitAttributes: getIsFetchingPlanUnitAttributes(state),
        areTargetsAllowedToHaveType: areTargetsAllowedToHaveType(state),
        isLockedForModifications: isLockedForModifications(state),
        isFetchingStages: isFetchingStages(state),
        isFetchingSubtypes: getIsFetchingSubtypes(state),
        isFetchingApplicationAttributes: getIsFetchingApplicationAttributes(state),
        isFetchingRelatedApplications: getIsFetchingRelatedApplications(state),
        applicationOpeningFormValues: getFormValues(FormNames.PLOT_SEARCH_APPLICATIONS_OPENING)(state),
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
      fetchApplicationAttributes,
      fetchPlotSearchRelatedApplications,
      receiveSinglePlotSearch,
      receiveFormValidFlags,
      deletePlotSearch,
    }
  ),
)(PlotSearchPage): React$ComponentType<OwnProps>);
