import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { initialize, isDirty, destroy, getFormValues } from "redux-form";
import type { ContextRouter } from "react-router";
import { FormNames } from "@/enums";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import PageContainer from "@/components/content/PageContainer";
import Loader from "@/components/loader/Loader";
import TabContent from "@/components/tabs/TabContent";
import TabPane from "@/components/tabs/TabPane";
import Tabs from "@/components/tabs/Tabs";
import ContentContainer from "@/components/content/ContentContainer";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "@/usersPermissions/selectors";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import { withPlotApplicationsAttributes } from "@/components/attributes/PlotApplicationsAttributes";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { getRouteById, Routes } from "@/root/routes";
import { Methods, PermissionMissingTexts } from "@/enums";
import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "@/util/storage";
import { getIsFetching, getCurrentPlotApplication, getIsSaveClicked, getIsFormValidById, getIsFormValidFlags, getIsPerformingFileOperation, getIsSaving } from "@/plotApplications/selectors";
import { fetchSinglePlotApplication, showEditMode, receiveIsSaveClicked, hideEditMode, clearFormValidFlags, receiveFormValidFlags, editPlotApplication, createPlotApplication } from "@/plotApplications/actions";
import { getUrlParams, setPageTitle, isMethodAllowed, getSearchQuery, scrollToTopPage } from "@/util/helpers";
import PlotApplicationInfo from "@/plotApplications/components/PlotApplicationInfo";
import { fetchPlotSearchList } from "@/plotSearch/actions";
import { getPlotSearchList, getIsFetching as getIsFetchingPlotSearchList } from "@/plotSearch/selectors";
import { preparePlotApplicationForSubmission } from "@/plotApplications/helpers";
import PlotApplicationCreate from "@/plotApplications/components/PlotApplicationCreate";
import type { PlotApplication as PlotApplicationType } from "@/plotApplications/types";
import type { Attributes, Methods as MethodsType } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type OwnProps = ContextRouter;
type Props = OwnProps & {
  clearFormValidFlags: (...args: Array<any>) => any;
  currentPlotApplication: PlotApplicationType;
  fetchSinglePlotApplication: (...args: Array<any>) => any;
  editPlotApplication: (...args: Array<any>) => any;
  createPlotApplication: (...args: Array<any>) => any;
  basicInformationFormValues: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  plotApplicationsMethods: MethodsType;
  plotApplicationsAttributes: Attributes;
  isFetchingPlotApplicationsAttributes: boolean;
  usersPermissions: UsersPermissionsType;
  isFetchingUsersPermissions: boolean;
  isFetching: boolean;
  isSaveClicked: boolean;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  isApplicationFormDirty: boolean;
  initialize: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
  isFormValidFlags: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  isFetchingPlotSearchList: boolean;
  fetchPlotSearchList: (...args: Array<any>) => any;
  isApplicationFormValid: boolean;
  isPerformingFileOperation: boolean;
  isSaving: boolean;
};
type State = {
  activeTab: number;
};

class PlotApplicationsPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false
  };
  static contextTypes = {
    router: PropTypes.object
  };
  timerAutoSave: any;

  componentDidMount() {
    const {
      clearFormValidFlags,
      receiveTopNavigationSettings,
      location: {
        search
      },
      receiveIsSaveClicked,
      fetchPlotSearchList
    } = this.props;
    const query = getUrlParams(search);

    if (query.tab) {
      this.setState({
        activeTab: query.tab
      });
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.PLOT_APPLICATIONS),
      pageTitle: 'Tonttihakemukset',
      showSearch: true
    });

    if (query.tab) {
      this.setState({
        activeTab: query.tab
      });
    }

    fetchPlotSearchList();
    setPageTitle('Uusi hakemus');
  }

  handleShowEditMode = () => {
    const {
      showEditMode,
      currentPlotApplication
    } = this.props;
    clearFormValidFlags();
    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentPlotApplication);
    this.startAutoSaveTimer();
  };
  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(() => this.saveUnsavedChanges(), 5000);
  };
  saveUnsavedChanges = () => {
    const {
      basicInformationFormValues,
      isApplicationFormDirty,
      isFormValidFlags
    } = this.props;
    let isDirty = false;

    if (isApplicationFormDirty) {
      setSessionStorageItem(FormNames.PLOT_APPLICATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.PLOT_APPLICATION);
    }

    if (isDirty) {
      setSessionStorageItem('newPlotApplicationValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('newPlotApplicationValidity');
    }
  };
  getAreFormsValid = () => {
    const {
      isApplicationFormValid
    } = this.props;
    return isApplicationFormValid;
  };
  cancelChanges = () => {
    const {
      history
    } = this.props;
    history.push(getRouteById(Routes.PLOT_APPLICATIONS));
  };
  handleBack = () => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    // Remove page specific url parameters when moving to application list page
    delete query.tab;
    return history.push({
      pathname: `${getRouteById(Routes.PLOT_APPLICATIONS)}`,
      search: getSearchQuery(query)
    });
  };
  handleTabClick = tabId => {
    const {
      history,
      location,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    this.setState({
      activeTab: tabId
    }, () => {
      query.tab = tabId;
      return history.push({ ...location,
        search: getSearchQuery(query)
      });
    });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      location: {
        search
      },
      currentPlotApplication,
      match: {
        params: {
          plotApplicationId
        }
      }
    } = this.props;
    const {
      activeTab
    } = this.state;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;

    if (tab !== activeTab) {
      this.setState({
        activeTab: tab
      });
    }

    if (prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    if (isEmpty(prevProps.currentPlotApplication) && !isEmpty(currentPlotApplication)) {
      const storedPlotApplicationId = getSessionStorageItem('plotApplicationId');

      if (Number(plotApplicationId) === storedPlotApplicationId) {// this.setState({isRestoreModalOpen: true});
      }
    }
  }

  saveChanges = () => {
    const {
      createPlotApplication,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);
    const areFormsValid = this.getAreFormsValid();

    if (areFormsValid) {
      const data = preparePlotApplicationForSubmission();

      if (!data) {
        // an error occurred
        receiveIsSaveClicked(false);
        console.log(data);
        return;
      }

      createPlotApplication(data);
    }
  };
  restoreUnsavedChanges = () => {
    const {
      clearFormValidFlags,
      currentPlotApplication,
      receiveFormValidFlags,
      showEditMode
    } = this.props;
    showEditMode();
    clearFormValidFlags();
    this.destroyAllForms();
    this.initializeForms(currentPlotApplication);
    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.PLOT_APPLICATION);

    if (storedBasicInformationFormValues) {// this.bulkChange(FormNames.PLOT_APPLICATION, storedBasicInformationFormValues);
    }

    const storedFormValidity = getSessionStorageItem('plotApplicationValidity');

    if (storedFormValidity) {
      receiveFormValidFlags(storedFormValidity);
    }

    this.startAutoSaveTimer(); // this.hideModal('Restore');
  };
  destroyAllForms = () => {
    const {
      destroy
    } = this.props;
    destroy(FormNames.PLOT_APPLICATION);
  };
  initializeForms = (currentPlotApplication: PlotApplicationType) => {
    const {
      initialize
    } = this.props;
    initialize(FormNames.PLOT_APPLICATION, currentPlotApplication);
  };

  render() {
    const {
      activeTab
    } = this.state;
    const {
      currentPlotApplication,
      isFetchingPlotApplicationsAttributes,
      plotApplicationsMethods,
      plotApplicationsAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
      isFetching,
      isSaveClicked,
      isApplicationFormDirty,
      isApplicationFormValid,
      isFetchingPlotSearchList,
      isPerformingFileOperation,
      isSaving
    } = this.props;
    const areFormsValid = this.getAreFormsValid();

    if (isFetching || isFetchingUsersPermissions || isFetchingPlotApplicationsAttributes || isFetchingPlotSearchList) {
      return <PageContainer><Loader isLoading={true} /></PageContainer>;
    }

    if (!plotApplicationsAttributes || !plotApplicationsMethods || isEmpty(usersPermissions)) {
      return null;
    }

    if (!isMethodAllowed(plotApplicationsMethods, Methods.GET)) {
      return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_APPLICATIONS} /></PageContainer>;
    }

    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowDelete={false} allowEdit={isMethodAllowed(plotApplicationsMethods, Methods.PATCH)} isCancelDisabled={isPerformingFileOperation || isSaving} isCopyDisabled={true} isEditDisabled={false} isEditMode={true} isSaveDisabled={isPerformingFileOperation || isSaving || isSaveClicked && !areFormsValid} onCancel={this.cancelChanges} onEdit={this.handleShowEditMode} onSave={this.saveChanges} showCommentButton={false} showCopyButton={false} />} infoComponent={<PlotApplicationInfo title={currentPlotApplication.plot_search} />} onBack={this.handleBack} />
          <Tabs active={activeTab} isEditMode={true} tabs={[{
          label: 'Hakemus',
          allow: true,
          isDirty: isApplicationFormDirty,
          hasError: isSaveClicked && !isApplicationFormValid
        }, {
          label: 'Muutoshistoria',
          allow: true
        }]} onTabClick={this.handleTabClick} />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                <PlotApplicationCreate />
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {'Muutoshistoria'}
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>;
  }

}

export default (flowRight(withRouter, withPlotApplicationsAttributes, connect(state => {
  return {
    basicInformationFormValues: getFormValues(FormNames.PLOT_APPLICATION)(state),
    currentPlotApplication: getCurrentPlotApplication(state),
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state),
    isFetching: getIsFetching(state),
    isSaveClicked: getIsSaveClicked(state),
    isApplicationFormDirty: isDirty(FormNames.PLOT_APPLICATION)(state),
    isApplicationFormValid: getIsFormValidById(state, FormNames.PLOT_APPLICATION),
    isFormValidFlags: getIsFormValidFlags(state),
    isFetchingPlotSearchList: getIsFetchingPlotSearchList(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    plotSearches: getPlotSearchList(state),
    isSaving: getIsSaving(state)
  };
}, {
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
  fetchPlotSearchList,
  createPlotApplication
}))(PlotApplicationsPage) as React.ComponentType<OwnProps>);