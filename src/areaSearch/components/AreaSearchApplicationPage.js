// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import {initialize, isDirty, destroy, getFormValues, isValid, change} from 'redux-form';
import type {ContextRouter} from 'react-router';

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
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {getRouteById, Routes} from '$src/root/routes';
import {ConfirmationModalTexts, Methods, PermissionMissingTexts} from '$src/enums';
/*import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from '$util/storage';*/
import {
  getIsEditMode,
  getIsSaveClicked,
  getIsFormValidFlags,
  getCurrentAreaSearch,
  getIsFetchingCurrentAreaSearch,
} from '$src/areaSearch/selectors';
import {
  showEditMode,
  receiveIsSaveClicked,
  hideEditMode,
  clearFormValidFlags,
  receiveFormValidFlags,
  fetchSingleAreaSearch,
} from '$src/areaSearch/actions';
import {
  getUrlParams,
  setPageTitle,
  isMethodAllowed,
  getSearchQuery,
  scrollToTopPage,
} from '$util/helpers';
import type {Attributes, Methods as MethodsType} from '$src/types';
import {clearUnsavedChanges} from '$src/contacts/helpers';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import AreaSearchApplication from '$src/areaSearch/components/AreaSearchApplication';
import {withAreaSearchAttributes} from '$components/attributes/AreaSearchAttributes';
import {getFormAttributes, getIsFetchingFormAttributes} from '$src/plotSearch/selectors';
import {fetchFormAttributes} from '$src/plotSearch/actions';

type OwnProps = {|

|};

type Props = {
  ...ContextRouter,
  ...OwnProps,
  clearFormValidFlags: Function,
  currentAreaSearch: ?Object,
  fetchSingleAreaSearch: Function,
  basicInformationFormValues: Object,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
  hideEditMode: Function,
  areaSearchAttributes: Attributes,
  areaSearchMethods: MethodsType,
  isFetchingAttributes: boolean,
  usersPermissions: UsersPermissionsType,
  isFetchingUsersPermissions: boolean,
  isFetching: boolean,
  isEditMode: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  initialize: Function,
  change: Function,
  destroy: Function,
  isFormValidFlags: boolean,
  receiveFormValidFlags: Function,
  isPerformingFileOperation: boolean,
  applicantInfoChecks: Array<Object>,
  targetInfoChecks: Array<Object>,
  isFormDirty: (string, ?Array<string>) => boolean,
  isFormValid: (string) => boolean,
  getValuesForForm: (string) => Object,
  batchEditApplicationInfoChecks: Function,
  isFetchingFormAttributes: boolean,
  formAttributes: Attributes,
  fetchFormAttributes: Function,
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
}

class AreaSearchApplicationPage extends Component<Props, State> {
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
      fetchSingleAreaSearch,
      match: {params: {areaSearchId}},
      location: {search},
      receiveIsSaveClicked,
      fetchFormAttributes,
    } = this.props;

    const query = getUrlParams(search);

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    fetchSingleAreaSearch(areaSearchId);
    fetchFormAttributes();
    setPageTitle('Hakemus');
  }

  componentWillUnmount() {
    this.props.hideEditMode();
    this.stopAutoSaveTimer();
  }

  handleShowEditMode = () => {
    const {showEditMode, receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    showEditMode();
    this.destroyAllForms();
    this.startAutoSaveTimer();
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

  saveUnsavedChanges = () => {

  }

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({isRestoreModalOpen: false});
  }

  getAreFormsValid = () => {
    return true;
  }

  cancelChanges = () => {
    const {
      hideEditMode,
      fetchSingleAreaSearch,
      match: {params: {areaSearchId}},
    } = this.props;

    // Reload all data in case we tried and managed to save some but not all info check data.
    // These could be patched to the current plot application directly upon receiving success too,
    // but that's a more complicated operation with minor gains over a refetch.
    fetchSingleAreaSearch(areaSearchId);
    hideEditMode();
    this.stopAutoSaveTimer();
    this.destroyAllForms();
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    // Remove page specific url parameters when moving to application list page
    delete query.tab;

    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}`,
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      location: {search},
      currentAreaSearch,
      //match: {params: {areaSearchId}},
      isFetching,
      isEditMode,
    } = this.props;
    const {activeTab} = this.state;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;


    if (tab !== activeTab) {
      this.setState({activeTab: tab});
    }

    if (prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    /*
    if (isEmpty(prevProps.currentAreaSearch) && !isEmpty(currentAreaSearch)) {
      const storedAreaSearchId = getSessionStorageItem('areaSearchId');

      if(Number(areaSearchId) === storedAreaSearchId) {
        this.setState({isRestoreModalOpen: true});
      }
    }
     */

    if (!isFetching && prevProps.isFetching) {
      setPageTitle(`Hakemus ${currentAreaSearch?.identifier || ''}`);
    }

    if (!isEditMode && prevProps.isEditMode) {
      this.stopAutoSaveTimer();
    }
  }

  saveChanges = () => {
    const {
      receiveIsSaveClicked,
    } = this.props;

    receiveIsSaveClicked(true);

    const areFormsValid = this.getAreFormsValid();

    if (areFormsValid) {
      // TODO
    }
  }

  restoreUnsavedChanges = () => {
    const {
      showEditMode,
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();

    this.startAutoSaveTimer();
    this.setState({isRestoreModalOpen: false});
  }

  destroyAllForms = () => {

  }

  render() {
    const {
      activeTab,
      isRestoreModalOpen,
    } = this.state;

    const {
      currentAreaSearch,
      isFetchingAttributes,
      areaSearchMethods,
      areaSearchAttributes,
      usersPermissions,
      isFetchingUsersPermissions,
      isFetching,
      isEditMode,
      isSaveClicked,
      isPerformingFileOperation,
    } = this.props;

    const areFormsValid = this.getAreFormsValid();

    if (isFetching || isFetchingUsersPermissions || isFetchingAttributes) {
      return <PageContainer><Loader isLoading={true} /></PageContainer>;
    }

    if (!areaSearchAttributes || !areaSearchMethods || isEmpty(usersPermissions)) {
      return null;
    }

    if (!isMethodAllowed(areaSearchMethods, Methods.GET)) {
      return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_APPLICATIONS}/></PageContainer>;
    }

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowDelete={false}
                allowEdit={isMethodAllowed(areaSearchMethods, Methods.PATCH)}
                isCopyDisabled={true}
                isEditDisabled={false}
                isEditMode={isEditMode}
                isSaveDisabled={isPerformingFileOperation || isSaveClicked && !areFormsValid}
                onCancel={this.cancelChanges}
                onEdit={this.handleShowEditMode}
                onSave={this.saveChanges}
                showCommentButton={false}
                showCopyButton={false}
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.BUTTON,
                  label: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.LABEL,
                  title: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.TITLE,
                }}
              />
            }
            infoComponent={<h1>{currentAreaSearch?.identifier}</h1>}
            onBack={this.handleBack}
          />
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Hakemus',
                allow: true,
                isDirty: false, //isApplicationFormDirty,
                hasError: isSaveClicked && !areFormsValid,
              },
              {
                label: 'Muutoshistoria',
                allow: true,
              },
              {
                label: 'Kartta',
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
                  ? <div />
                  : <AreaSearchApplication />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {'Muutoshistoria'}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {'Kartta'}
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
  withAreaSearchAttributes,
  connect(
    (state) => {
      return {
        currentAreaSearch: getCurrentAreaSearch(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        usersPermissions: getUsersPermissions(state),
        isFetching: getIsFetchingCurrentAreaSearch(state),
        isEditMode: getIsEditMode(state),
        isSaveClicked: getIsSaveClicked(state),
        isFormValidFlags: getIsFormValidFlags(state),
        formAttributes: getFormAttributes(state),
        isFetchingFormAttributes: getIsFetchingFormAttributes(state),
        isFormDirty: (formName, fields) => {
          // isDirty doesn't ignore the second parameter even if it's undefined, and always returns false in that case,
          // so branching is required to use this with both form-specific and field-specific queries.
          if (fields) {
            return isDirty(formName)(state, fields);
          } else {
            return isDirty(formName)(state);
          }
        },
        getValuesForForm: (formName) => getFormValues(formName)(state),
        isFormValid: (formName) => isValid(formName)(state),
      };
    },
    {
      destroy,
      fetchSingleAreaSearch,
      fetchFormAttributes,
      receiveTopNavigationSettings,
      showEditMode,
      hideEditMode,
      receiveIsSaveClicked,
      initialize,
      change,
      clearFormValidFlags,
      receiveFormValidFlags,
    }
  ),
)(AreaSearchApplicationPage): React$ComponentType<OwnProps>);
