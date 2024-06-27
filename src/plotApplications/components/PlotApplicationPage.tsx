import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { groupBy } from "lodash/collection";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { initialize, isDirty, destroy, getFormValues, isValid, change } from "redux-form";
import type { ContextRouter } from "react-router";
import { FormNames } from "enums";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import FullWidthContainer from "/src/components/content/FullWidthContainer";
import PageContainer from "/src/components/content/PageContainer";
import { ButtonColors } from "/src/components/enums";
import Loader from "/src/components/loader/Loader";
import TabContent from "/src/components/tabs/TabContent";
import TabPane from "/src/components/tabs/TabPane";
import Tabs from "/src/components/tabs/Tabs";
import ContentContainer from "/src/components/content/ContentContainer";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import PageNavigationWrapper from "/src/components/content/PageNavigationWrapper";
import ControlButtonBar from "/src/components/controlButtons/ControlButtonBar";
import ControlButtons from "/src/components/controlButtons/ControlButtons";
import { withPlotApplicationsAttributes } from "/src/components/attributes/PlotApplicationsAttributes";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { getRouteById, Routes } from "root/routes";
import { ConfirmationModalTexts, Methods, PermissionMissingTexts } from "enums";
import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "util/storage";
import { getIsFetching, getCurrentPlotApplication, getIsEditMode, getIsSaveClicked, getIsFormValidFlags, getIsPerformingFileOperation, getIsSaving, getIsSingleAllowed, getApplicationRelatedPlotSearch, getApplicationApplicantInfoCheckData, getApplicationTargetInfoCheckData } from "/src/plotApplications/selectors";
import { fetchSinglePlotApplication, showEditMode, receiveIsSaveClicked, hideEditMode, clearFormValidFlags, receiveFormValidFlags, batchEditApplicationModels } from "/src/plotApplications/actions";
import type { PlotApplication as PlotApplicationType } from "/src/plotApplications/types";
import { getUrlParams, setPageTitle, isMethodAllowed, getSearchQuery, scrollToTopPage } from "util/helpers";
import type { Attributes, Methods as MethodsType } from "types";
import PlotApplicationInfo from "/src/plotApplications/components/PlotApplicationInfo";
import PlotApplication from "/src/plotApplications/components/PlotApplication";
import PlotApplicationEdit from "/src/plotApplications/components/PlotApplicationEdit";
import { getPlotSearchList } from "/src/plotSearch/selectors";
import { getInitialTargetInfoCheckValues, getTargetInfoCheckFormName } from "/src/plotApplications/helpers";
import type { PlotSearch } from "/src/plotSearch/types";
import type { InfoCheckBatchEditData } from "/src/plotApplications/types";
import { clearUnsavedChanges } from "/src/contacts/helpers";
import ConfirmationModal from "/src/components/modal/ConfirmationModal";
import { getApplicantInfoCheckFormName, getApplicantInfoCheckItems, prepareApplicantInfoCheckForSubmission } from "/src/application/helpers";
type OwnProps = {};
type Props = ContextRouter & OwnProps & {
  clearFormValidFlags: (...args: Array<any>) => any;
  currentPlotApplication: PlotApplicationType;
  fetchSinglePlotApplication: (...args: Array<any>) => any;
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
  isEditMode: boolean;
  isSaveClicked: boolean;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  initialize: (...args: Array<any>) => any;
  change: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
  isFormValidFlags: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  isPerformingFileOperation: boolean;
  isSaving: boolean;
  currentPlotSearch: PlotSearch | null | undefined;
  applicantInfoChecks: Array<Record<string, any>>;
  targetInfoChecks: Array<Record<string, any>>;
  isFormDirty: (arg0: string, arg1: Array<string> | null | undefined) => boolean;
  isFormValid: (arg0: string) => boolean;
  getValuesForForm: (arg0: string) => Record<string, any>;
  batchEditApplicationModels: (...args: Array<any>) => any;
  isSingleAllowed: boolean;
};
type State = {
  activeTab: number;
  isRestoreModalOpen: boolean;
  applicantInfoCheckFormNames: Array<string>;
  targetInfoCheckFormNames: Array<string>;
};

class PlotApplicationPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
    applicantInfoCheckFormNames: [],
    targetInfoCheckFormNames: []
  };
  static contextTypes = {
    router: PropTypes.object
  };
  timerAutoSave: any;

  componentDidMount() {
    const {
      clearFormValidFlags,
      receiveTopNavigationSettings,
      fetchSinglePlotApplication,
      match: {
        params: {
          plotApplicationId
        }
      },
      location: {
        search
      },
      receiveIsSaveClicked
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

    fetchSinglePlotApplication(plotApplicationId);
    setPageTitle('Hakemus');
  }

  componentWillUnmount() {
    this.props.hideEditMode();
    this.stopAutoSaveTimer();
  }

  handleShowEditMode = () => {
    const {
      showEditMode,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    showEditMode();
    this.destroyAllForms();
    this.initializeInfoCheckForms();
    this.startAutoSaveTimer();
  };
  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(() => this.saveUnsavedChanges(), 5000);
  };
  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  };
  saveUnsavedChanges = () => {
    const {
      currentPlotApplication,
      isFormDirty,
      getValuesForForm
    } = this.props;
    const {
      targetInfoCheckFormNames,
      applicantInfoCheckFormNames
    } = this.state;
    let dirtyInfoCheckForms = {};
    [...targetInfoCheckFormNames, ...applicantInfoCheckFormNames].forEach(formName => {
      if (isFormDirty(formName)) {
        dirtyInfoCheckForms[formName] = getValuesForForm(formName);
      }
    });
    const anyInfoCheckFormsDirty = Object.keys(dirtyInfoCheckForms).length > 0;
    const anyOtherFormsDirty = isFormDirty(FormNames.PLOT_APPLICATION_OPENING);

    if (anyInfoCheckFormsDirty) {
      setSessionStorageItem('plotApplicationInfoChecks', dirtyInfoCheckForms);
    } else {
      removeSessionStorageItem('plotApplicationInfoChecks');
    }

    if (anyOtherFormsDirty) {
      setSessionStorageItem('plotApplicationOpeningRecord', getValuesForForm(FormNames.PLOT_APPLICATION_OPENING));
    } else {
      removeSessionStorageItem('plotApplicationOpeningRecord');
    }

    if (anyInfoCheckFormsDirty || anyOtherFormsDirty) {
      setSessionStorageItem('plotApplicationId', currentPlotApplication.id);
    } else {
      removeSessionStorageItem('plotApplicationId');
    }
  };
  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({
      isRestoreModalOpen: false
    });
  };
  getAreFormsValid = () => {
    const {
      isFormValid
    } = this.props;
    const {
      targetInfoCheckFormNames
    } = this.state;
    // Applicant forms are considered to be valid by default
    // because they're already validated in their own popup editor,
    // which doesn't let you proceed if any validation errors are present.
    return [...targetInfoCheckFormNames, FormNames.PLOT_APPLICATION_OPENING].every(name => isFormValid(name));
  };
  cancelChanges = () => {
    const {
      hideEditMode,
      fetchSinglePlotApplication,
      match: {
        params: {
          plotApplicationId
        }
      }
    } = this.props;
    // Reload all data in case we tried and managed to save some but not all info check data.
    // These could be patched to the current plot application directly upon receiving success too,
    // but that's a more complicated operation with minor gains over a refetch.
    fetchSinglePlotApplication(plotApplicationId);
    hideEditMode();
    this.stopAutoSaveTimer();
    this.destroyAllForms();
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
      },
      isFetching,
      isEditMode,
      getValuesForForm
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

      if (isEditMode && !getValuesForForm('id')) {
        this.handleShowEditMode();
      }

      if (Number(plotApplicationId) === storedPlotApplicationId) {
        this.setState({
          isRestoreModalOpen: true
        });
      }
    }

    if (!isFetching && prevProps.isFetching) {
      setPageTitle(`Hakemus ${currentPlotApplication.id}`);
    }

    if (!isEditMode && prevProps.isEditMode) {
      this.stopAutoSaveTimer();
    }
  }

  initializeInfoCheckForms = () => {
    const {
      currentPlotApplication,
      initialize,
      currentPlotSearch,
      targetInfoChecks,
      applicantInfoChecks
    } = this.props;
    let applicantInfoCheckFormNames = [];
    let targetInfoCheckFormNames = [];
    currentPlotApplication.targets.forEach(target => {
      initialize(getTargetInfoCheckFormName(target), getInitialTargetInfoCheckValues(currentPlotSearch, targetInfoChecks, target));
      targetInfoCheckFormNames.push(getTargetInfoCheckFormName(target));
    });
    const applicantInfoChecksByApplicantId = groupBy(applicantInfoChecks, 'entry');
    Object.keys(applicantInfoChecksByApplicantId).forEach(key => {
      const infoChecks = getApplicantInfoCheckItems(applicantInfoChecksByApplicantId[key]);
      infoChecks.forEach(infoCheck => {
        initialize(getApplicantInfoCheckFormName(infoCheck.data.id), infoCheck);
        applicantInfoCheckFormNames.push(getApplicantInfoCheckFormName(infoCheck.data.id));
      });
    });
    this.setState(() => ({
      applicantInfoCheckFormNames,
      targetInfoCheckFormNames
    }));
  };
  saveChanges = () => {
    const {
      receiveIsSaveClicked,
      isFormDirty,
      getValuesForForm,
      batchEditApplicationModels
    } = this.props;
    const {
      targetInfoCheckFormNames,
      applicantInfoCheckFormNames
    } = this.state;
    receiveIsSaveClicked(true);
    const areFormsValid = this.getAreFormsValid();
    const operations: InfoCheckBatchEditData = {
      target: [],
      applicant: [],
      opening_record: null
    };

    if (areFormsValid) {
      targetInfoCheckFormNames.forEach(target => {
        const data = getValuesForForm(target);

        if (isFormDirty(target)) {
          operations.target.push({
            id: data.id,
            targetForm: target,
            data: { ...data,
              meeting_memos: undefined,
              decline_reason: data.decline_reason || null
            }
          });
        }
      });
      applicantInfoCheckFormNames.forEach(target => {
        const infoCheck = getValuesForForm(target);

        if (isFormDirty(target)) {
          operations.applicant.push({
            id: infoCheck.data.id,
            kind: infoCheck.kind,
            data: prepareApplicantInfoCheckForSubmission(infoCheck.data)
          });
        }
      });

      if (isFormDirty(FormNames.PLOT_APPLICATION_OPENING)) {
        const openingRecordValues = getValuesForForm(FormNames.PLOT_APPLICATION_OPENING).opening_record;
        operations.opening_record = { ...openingRecordValues,
          openers: openingRecordValues.openers.map(opener => opener.id)
        };
      }

      batchEditApplicationModels(operations);
    }
  };
  restoreUnsavedChanges = () => {
    const {
      showEditMode,
      change
    } = this.props;
    showEditMode();
    clearFormValidFlags();
    this.destroyAllForms();
    this.initializeInfoCheckForms();
    const storedInfoCheckData = getSessionStorageItem('plotApplicationInfoChecks');
    Object.keys(storedInfoCheckData).forEach(formName => {
      Object.keys(storedInfoCheckData[formName]).forEach(field => {
        change(formName, field, storedInfoCheckData[formName][field]);
      });
    });
    const storedOpeningRecordData = getSessionStorageItem('plotApplicationOpeningRecord');

    if (storedOpeningRecordData) {
      change(FormNames.PLOT_APPLICATION_OPENING, 'opening_record', storedOpeningRecordData.opening_record);
    }

    this.startAutoSaveTimer();
    this.setState({
      isRestoreModalOpen: false
    });
  };
  destroyAllForms = () => {
    const {
      destroy
    } = this.props;
    const {
      applicantInfoCheckFormNames,
      targetInfoCheckFormNames
    } = this.state;
    destroy(FormNames.PLOT_APPLICATION);
    applicantInfoCheckFormNames.map(name => destroy(name));
    targetInfoCheckFormNames.map(name => destroy(name));
    this.setState(() => ({
      applicantInfoCheckFormNames: [],
      targetInfoCheckFormNames: []
    }));
  };

  render() {
    const {
      activeTab,
      isRestoreModalOpen
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
      isPerformingFileOperation,
      isSaving,
      isSingleAllowed
    } = this.props;
    const areFormsValid = this.getAreFormsValid();

    if (isFetching || isFetchingUsersPermissions || isFetchingPlotApplicationsAttributes) {
      return <PageContainer><Loader isLoading={true} /></PageContainer>;
    }

    if (!plotApplicationsAttributes || !plotApplicationsMethods || isEmpty(usersPermissions)) {
      return null;
    }

    if (!isMethodAllowed(plotApplicationsMethods, Methods.GET)) {
      return <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.PLOT_APPLICATIONS} />
      </PageContainer>;
    }

    if (!isFetching && !isSingleAllowed) {
      return <PageContainer>
        <AuthorizationError text="Sinulla ei tällä hetkellä ole oikeutta nähdä tätä hakemusta. Mikäli hakemukseen liittyvä haku on päättynyt, valmistelija voi avata hakemuksen listanäkymän kautta." />
      </PageContainer>;
    }

    if (!isFetching && !currentPlotApplication.id) {
      return <PageContainer>
        <AuthorizationError text="Hakemusta ei löydy." />
      </PageContainer>;
    }

    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowDelete={false} allowEdit={isMethodAllowed(plotApplicationsMethods, Methods.PATCH)} isCancelDisabled={isPerformingFileOperation || isSaving} isCopyDisabled={true} isEditDisabled={false} isEditMode={isEditMode} isSaveDisabled={isPerformingFileOperation || isSaving || isSaveClicked && !areFormsValid} onCancel={this.cancelChanges} onEdit={this.handleShowEditMode} onSave={this.saveChanges} showCommentButton={false} showCopyButton={false} deleteModalTexts={{
          buttonClassName: ButtonColors.ALERT,
          buttonText: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.BUTTON,
          label: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.LABEL,
          title: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.TITLE
        }} />} infoComponent={<PlotApplicationInfo title={currentPlotApplication.plot_search} />} onBack={this.handleBack} />
          <Tabs active={activeTab} isEditMode={isEditMode} tabs={[{
          label: 'Hakemus',
          allow: true,
          isDirty: false,
          //isApplicationFormDirty,
          hasError: isSaveClicked && !areFormsValid
        }, {
          label: 'Muutoshistoria',
          allow: true
        }]} onTabClick={this.handleTabClick} />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <ConfirmationModal confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON} isOpen={isRestoreModalOpen} label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL} onCancel={this.cancelRestoreUnsavedChanges} onClose={this.cancelRestoreUnsavedChanges} onSave={this.restoreUnsavedChanges} title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE} />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode ? <PlotApplicationEdit /> : <PlotApplication />}
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
    isEditMode: getIsEditMode(state),
    isSaveClicked: getIsSaveClicked(state),
    isFormValidFlags: getIsFormValidFlags(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    isSingleAllowed: getIsSingleAllowed(state),
    plotSearches: getPlotSearchList(state),
    isSaving: getIsSaving(state),
    currentPlotSearch: getApplicationRelatedPlotSearch(state),
    applicantInfoChecks: getApplicationApplicantInfoCheckData(state),
    targetInfoChecks: getApplicationTargetInfoCheckData(state),
    isFormDirty: (formName, fields) => {
      // isDirty doesn't ignore the second parameter even if it's undefined, and always returns false in that case,
      // so branching is required to use this with both form-specific and field-specific queries.
      if (fields) {
        return isDirty(formName)(state, fields);
      } else {
        return isDirty(formName)(state);
      }
    },
    getValuesForForm: formName => getFormValues(formName)(state),
    isFormValid: formName => isValid(formName)(state)
  };
}, {
  destroy,
  fetchSinglePlotApplication,
  receiveTopNavigationSettings,
  showEditMode,
  hideEditMode,
  receiveIsSaveClicked,
  initialize,
  change,
  clearFormValidFlags,
  receiveFormValidFlags,
  batchEditApplicationModels
}))(PlotApplicationPage) as React.ComponentType<OwnProps>);