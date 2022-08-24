// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import {initialize, isDirty, destroy, getFormValues} from 'redux-form';

import {FormNames} from '$src/enums';
import AuthorizationError from '$components/authorization/AuthorizationError';
import FullWidthContainer from '$components/content/FullWidthContainer';
import PageContainer from '$components/content/PageContainer';
import {ButtonColors} from '$components/enums';
import Loader from '$components/loader/Loader';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import Tabs from '$components/tabs/Tabs';
import ContentContainer from '$components/content/ContentContainer';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import {withPlotApplicationsAttributes} from '$components/attributes/PlotApplicationsAttributes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById, Routes} from '$src/root/routes';
import {ConfirmationModalTexts, Methods, PermissionMissingTexts} from '$src/enums';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {
  getIsFetching,
  getCurrentPlotApplication,
  getIsEditMode,
  getIsSaveClicked,
  getIsFormValidById,
  getIsFormValidFlags,
} from '$src/plotApplications/selectors';
import {
  fetchSinglePlotApplication,
  showEditMode,
  receiveIsSaveClicked,
  hideEditMode,
  clearFormValidFlags,
  receiveFormValidFlags,
  editPlotApplication,
} from '$src/plotApplications/actions';
import type {
  PlotApplication as PlotApplicationType,
} from '$src/plotApplications/types';
import {
  getUrlParams,
  setPageTitle,
  isMethodAllowed,
  getSearchQuery,
  scrollToTopPage,
} from '$util/helpers';
import type {Attributes, Methods as MethodsType} from '$src/types';
import PlotApplicationInfo from './PlotApplicationInfo';
import PlotApplication from './PlotApplication';
import PlotApplicationEdit from './PlotApplicationEdit';

type Props = {
  clearFormValidFlags: Function,
  currentPlotApplication: PlotApplicationType,
  fetchSinglePlotApplication: Function,
  editPlotApplication: Function,
  basicInformationFormValues: Object,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
  hideEditMode: Function,
  location: Object,
  match: {
    params: Object,
  },
  plotApplicationsMethods: MethodsType,
  plotApplicationsAttributes: Attributes,
  isFetchingPlotApplicationsAttributes: boolean,
  usersPermissions: UsersPermissionsType,
  isFetchingUsersPermissions: boolean,
  isFetching: boolean,
  isEditMode: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  history: Object,
  isBasicInformationFormDirty: boolean,
  initialize: Function,
  destroy: Function,
  isFormValidFlags: boolean,
  receiveFormValidFlags: Function,
}

type State = {
  activeTab: number,
}

class PlotApplicationsPage extends Component<Props, State> {
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
      fetchSinglePlotApplication,
      match: {params: {plotApplicationId}},
      location: {search},
      receiveIsSaveClicked,

    } = this.props;

    const query = getUrlParams(search);

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    setPageTitle('Test 123');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_APPLICATIONS),
      pageTitle: 'Tonttihakemukset',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    fetchSinglePlotApplication(plotApplicationId);
  }

  handleShowEditMode = () => {
    const {showEditMode, receiveIsSaveClicked, currentPlotApplication} = this.props;
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentPlotApplication);
    this.startAutoSaveTimer();
  }

  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(
      () => this.saveUnsavedChanges(),
      5000
    );
  }

  saveUnsavedChanges = () => {
    const {
      basicInformationFormValues,
      isBasicInformationFormDirty,
      isFormValidFlags,
      match: {params: {plotApplicationId}},
    } = this.props;
    
    let isDirty = false;

    if(isBasicInformationFormDirty) {
      setSessionStorageItem(FormNames.PLOT_APPLICATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PLOT_APPLICATION);
    }

    if(isDirty) {
      setSessionStorageItem('plotApplicationId', plotApplicationId);
      setSessionStorageItem('plotApplicationValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('plotApplicationId');
      removeSessionStorageItem('plotApplicationValidity');
    }
  }

  // TODO
  getAreFormsValid = () => {
    return (
      true
    );
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

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
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}`,
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

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {
      location: {search},
      currentPlotApplication,
      match: {params: {plotApplicationId}},
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

    if(isEmpty(prevProps.currentPlotApplication) && !isEmpty(currentPlotApplication)) {
      const storedPlotApplicationId = getSessionStorageItem('plotApplicationId');

      if(Number(plotApplicationId) === storedPlotApplicationId) {
        // this.setState({isRestoreModalOpen: true});
      }
    }
  }

  saveChanges = () => {
    const {receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.getAreFormsValid();

    if(areFormsValid) {
      const {
        basicInformationFormValues,
        currentPlotApplication,
        editPlotApplication,
        isBasicInformationFormDirty,
      } = this.props;
    
      let payload: Object = {...currentPlotApplication};

      if(isBasicInformationFormDirty || !isBasicInformationFormDirty) {
        payload = {...payload, ...basicInformationFormValues};
      }

      editPlotApplication(payload);
    }
  }

  restoreUnsavedChanges = () => {
    const {
      clearFormValidFlags,
      currentPlotApplication,
      receiveFormValidFlags,
      showEditMode,
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentPlotApplication);

    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.PLOT_APPLICATION);
    if(storedBasicInformationFormValues) {
      // this.bulkChange(FormNames.PLOT_APPLICATION, storedBasicInformationFormValues);
    }

    const storedFormValidity = getSessionStorageItem('plotApplicationValidity');
    if(storedFormValidity) {
      receiveFormValidFlags(storedFormValidity);
    }

    this.startAutoSaveTimer();
    // this.hideModal('Restore');
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.PLOT_APPLICATION);
  }

  initializeForms = (currentPlotApplication: PlotApplication) => {
    const {initialize} = this.props;
    initialize(FormNames.PLOT_APPLICATION, currentPlotApplication);
    // initialize(FormNames.PLOT_APPLICATION, getContentBasicInformation(currentPlotApplication));
  }

  render() {
    const {
      activeTab,
    } = this.state;
    
    const {
      currentPlotApplication,
      isFetchingPlotApplicationsAttributes,
      plotApplicationsMethods,
      plotApplicationsAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
      isFetching,
      isEditMode,
      isSaveClicked,
      isBasicInformationFormDirty,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if(isFetching || isFetchingUsersPermissions || isFetchingPlotApplicationsAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!plotApplicationsAttributes || isEmpty(usersPermissions)) return null;

    if(!plotApplicationsMethods) return null;

    if(!isMethodAllowed(plotApplicationsMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_APPLICATIONS} /></PageContainer>;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowDelete={isMethodAllowed(plotApplicationsMethods, Methods.DELETE)}
                allowEdit={isMethodAllowed(plotApplicationsMethods, Methods.PATCH)}
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
                onDelete={()=>{}} // this.handleDelete
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.BUTTON,
                  label: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.LABEL,
                  title: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.TITLE,
                }}
              />
            }
            infoComponent={<PlotApplicationInfo title={currentPlotApplication.plot_search}/>}
            onBack={this.handleBack}
          />
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Hakemus',
                allow: true,
                isDirty: isBasicInformationFormDirty,
                hasError: false, // isSaveClicked && !isBasicInformationFormValid,
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
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <PlotApplicationEdit/>
                  : <PlotApplication/>
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {'Muutoshistoria'}
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
  withPlotApplicationsAttributes,
  connect(
    (state) => {
      return {
        basicInformationFormValues: getFormValues(FormNames.PLOT_APPLICATION)(state),
        currentPlotApplication: getCurrentPlotApplication(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetching(state),
        isEditMode: getIsEditMode(state),
        isSaveClicked: getIsSaveClicked(state),
        isBasicInformationFormDirty: isDirty(FormNames.PLOT_APPLICATION)(state),
        isBasicInformationFormValid: getIsFormValidById(state, FormNames.PLOT_APPLICATION),
        isFormValidFlags: getIsFormValidFlags(state),
      };
    },
    {
      destroy,
      fetchSinglePlotApplication,
      receiveTopNavigationSettings,
      showEditMode,
      hideEditMode,
      receiveIsSaveClicked,
      initialize,
      clearFormValidFlags,
      receiveFormValidFlags,
      editPlotApplication,
    }
  ),
)(PlotApplicationsPage);
