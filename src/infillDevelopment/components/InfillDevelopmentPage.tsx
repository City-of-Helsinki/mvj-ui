import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { change, destroy, getFormValues, isDirty } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import Authorization from "/src/components/authorization/Authorization";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import ConfirmationModal from "/src/components/modal/ConfirmationModal";
import ContentContainer from "/src/components/content/ContentContainer";
import ControlButtonBar from "/src/components/controlButtons/ControlButtonBar";
import ControlButtons from "/src/components/controlButtons/ControlButtons";
import Divider from "/src/components/content/Divider";
import FullWidthContainer from "/src/components/content/FullWidthContainer";
import InfillDevelopmentForm from "./forms/InfillDevelopmentForm";
import InfillDevelopmentTemplate from "./sections/basicInfo/InfillDevelopmentTemplate";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import PageContainer from "/src/components/content/PageContainer";
import PageNavigationWrapper from "/src/components/content/PageNavigationWrapper";
import SingleInfillDevelopmentMap from "./sections/map/SingleInfillDevelopmentMap";
import Tabs from "/src/components/tabs/Tabs";
import TabContent from "/src/components/tabs/TabContent";
import TabPane from "/src/components/tabs/TabPane";
import Title from "/src/components/content/Title";
import { clearFormValidFlags, editInfillDevelopment, fetchSingleInfillDevelopment, hideEditMode, receiveFormInitialValues, receiveSingleInfillDevelopment, receiveIsSaveClicked, showEditMode } from "/src/infillDevelopment/actions";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { ConfirmationModalTexts, FormNames, Methods, PermissionMissingTexts } from "enums";
import { InfillDevelopmentCompensationFieldPaths, InfillDevelopmentCompensationFieldTitles, InfillDevelopmentCompensationLeasesFieldPaths } from "/src/infillDevelopment/enums";
import { clearUnsavedChanges, getContentInfillDevelopment, getCopyOfInfillDevelopment, getPayloadInfillDevelopment } from "/src/infillDevelopment/helpers";
import { getUiDataInfillDevelopmentKey } from "uiData/helpers";
import { getSearchQuery, getUrlParams, isFieldAllowedToRead, isMethodAllowed, scrollToTopPage, setPageTitle } from "util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getCurrentInfillDevelopment, getIsEditMode, getIsFetching, getIsFormValidById, getIsSaveClicked, getIsSaving } from "/src/infillDevelopment/selectors";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "usersPermissions/selectors";
import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "util/storage";
import { withInfillDevelopmentPageAttributes } from "/src/components/attributes/InfillDevelopmentPageAttributes";
import { withUiDataList } from "/src/components/uiData/UiDataListHOC";
import type { Attributes, Methods as MethodsType } from "types";
import type { InfillDevelopment } from "/src/infillDevelopment/types";
import type { UsersPermissions } from "usersPermissions/types";
type Props = {
  change: (...args: Array<any>) => any;
  clearFormValidFlags: (...args: Array<any>) => any;
  currentInfillDevelopment: InfillDevelopment;
  destroy: (...args: Array<any>) => any;
  editInfillDevelopment: (...args: Array<any>) => any;
  fetchSingleInfillDevelopment: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  infillDevelopmentAttributes: Attributes;
  // get via withInfillDevelopmentPageAttributes HOC
  infillDevelopmentFormValues: Record<string, any>;
  infillDevelopmentMethods: MethodsType;
  // get via withInfillDevelopmentPageAttributes HOC
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingInfillDevelopmentPageAttributes: boolean;
  // get via withInfillDevelopmentPageAttributes HOC
  isFetchingUsersPermissions: boolean;
  isFormValid: boolean;
  isInfillDevelopmentFormDirty: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  location: Record<string, any>;
  match: {
    params: Record<string, any>;
  };
  receiveFormInitialValues: (...args: Array<any>) => any;
  receiveSingleInfillDevelopment: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
  usersPermissions: UsersPermissions;
};
type State = {
  activeTab: number;
  currentInfillDevelopment: InfillDevelopment;
  formatedInfillDevelopment: any;
  isRestoreModalOpen: boolean;
};

class InfillDevelopmentPage extends Component<Props, State> {
  state: State = {
    activeTab: 0,
    formatedInfillDevelopment: {},
    currentInfillDevelopment: {},
    isRestoreModalOpen: false
  };
  static contextTypes = {
    router: PropTypes.object
  };
  timerAutoSave: any;

  componentDidMount() {
    const {
      fetchSingleInfillDevelopment,
      hideEditMode,
      location: {
        search
      },
      match: {
        params: {
          infillDevelopmentId
        }
      },
      receiveIsSaveClicked,
      receiveTopNavigationSettings
    } = this.props;
    const query = getUrlParams(search);
    this.setPageTitle();
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
      pageTitle: 'Täydennysrakentamiskorvaukset',
      showSearch: false
    });

    if (query.tab) {
      this.setState({
        activeTab: query.tab
      });
    }

    receiveIsSaveClicked(false);
    fetchSingleInfillDevelopment(infillDevelopmentId);
    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.currentInfillDevelopment !== state.currentInfillDevelopment) {
      return {
        currentInfillDevelopment: props.currentInfillDevelopment,
        formatedInfillDevelopment: getContentInfillDevelopment(props.currentInfillDevelopment)
      };
    }

    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      currentInfillDevelopment,
      isEditMode,
      match: {
        params: {
          infillDevelopmentId
        }
      }
    } = this.props;
    const {
      activeTab
    } = this.state;

    if (prevProps.currentInfillDevelopment !== currentInfillDevelopment) {
      this.setPageTitle();
    }

    if (isEmpty(prevProps.currentInfillDevelopment) && !isEmpty(currentInfillDevelopment)) {
      const storedInfillDevelopmentId = getSessionStorageItem('infillDevelopmentId');

      if (Number(infillDevelopmentId) === storedInfillDevelopmentId) {
        this.setState({
          isRestoreModalOpen: true
        });
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if (prevProps.isEditMode && !isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }

    if (prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      match: {
        params: {
          infillDevelopmentId
        }
      },
      location: {
        pathname
      },
      receiveSingleInfillDevelopment
    } = this.props;

    if (pathname !== `${getRouteById(Routes.INFILL_DEVELOPMENTS)}/${infillDevelopmentId}`) {
      clearUnsavedChanges();
    }

    this.stopAutoSaveTimer();
    // Clear current infill development compensation
    receiveSingleInfillDevelopment({});
    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    const {
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;
    // Set correct active tab on back/forward button press
    this.setState({
      activeTab: tab
    });
  };
  setPageTitle = () => {
    const {
      currentInfillDevelopment
    } = this.props;
    const name = currentInfillDevelopment && currentInfillDevelopment.name || '';
    setPageTitle(`${name ? `${name} | ` : ''}Täydennysrakentamiskorvaus`);
  };
  handleLeavePage = e => {
    const {
      isEditMode,
      isInfillDevelopmentFormDirty
    } = this.props;

    if (isInfillDevelopmentFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };
  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(() => this.storeUnsavedChanges(), 5000);
  };
  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  };
  storeUnsavedChanges = () => {
    const {
      infillDevelopmentFormValues,
      isInfillDevelopmentFormDirty,
      match: {
        params: {
          infillDevelopmentId
        }
      }
    } = this.props;

    if (isInfillDevelopmentFormDirty) {
      setSessionStorageItem(FormNames.INFILL_DEVELOPMENT, infillDevelopmentFormValues);
      setSessionStorageItem('infillDevelopmentId', infillDevelopmentId);
    } else {
      removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
      removeSessionStorageItem('infillDevelopmentId');
    }
  };
  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.setState({
      isRestoreModalOpen: false
    });
  };
  restoreUnsavedChanges = () => {
    const {
      currentInfillDevelopment,
      receiveFormInitialValues,
      showEditMode
    } = this.props;
    showEditMode();
    receiveFormInitialValues(getContentInfillDevelopment(currentInfillDevelopment));
    setTimeout(() => {
      const storedInfillDevelopmentFormValues = getSessionStorageItem(FormNames.INFILL_DEVELOPMENT);

      if (storedInfillDevelopmentFormValues) {
        this.bulkChange(FormNames.INFILL_DEVELOPMENT, storedInfillDevelopmentFormValues);
      }
    }, 20);
    this.startAutoSaveTimer();
    this.setState({
      isRestoreModalOpen: false
    });
  };
  bulkChange = (formName: string, obj: Record<string, any>) => {
    const {
      change
    } = this.props;
    const fields = Object.keys(obj);
    fields.forEach(field => {
      change(formName, field, obj[field]);
    });
  };
  copyInfillDevelopment = () => {
    const {
      currentInfillDevelopment,
      hideEditMode,
      history,
      location: {
        search
      },
      receiveFormInitialValues
    } = this.props;
    const infillDevelopment = { ...currentInfillDevelopment
    };
    infillDevelopment.id = undefined;
    receiveFormInitialValues(getCopyOfInfillDevelopment(infillDevelopment));
    hideEditMode();
    clearUnsavedChanges();
    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENT_NEW),
      search: search
    });
  };
  handleBack = () => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    delete query.lease;
    delete query.tab;
    return history.push({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: getSearchQuery(query)
    });
  };
  handleShowEditMode = () => {
    const {
      clearFormValidFlags,
      currentInfillDevelopment,
      receiveFormInitialValues,
      receiveIsSaveClicked,
      showEditMode
    } = this.props;
    receiveIsSaveClicked(false);
    showEditMode();
    clearFormValidFlags();
    this.destroyAllForms();
    receiveFormInitialValues(getContentInfillDevelopment(currentInfillDevelopment));
    this.startAutoSaveTimer();
  };
  cancelChanges = () => {
    const {
      hideEditMode
    } = this.props;
    hideEditMode();
  };
  saveChanges = () => {
    const {
      isFormValid,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);

    if (isFormValid) {
      const {
        currentInfillDevelopment,
        infillDevelopmentFormValues,
        editInfillDevelopment
      } = this.props;
      const editedInfillDevelopment = getPayloadInfillDevelopment(infillDevelopmentFormValues);
      editedInfillDevelopment.id = currentInfillDevelopment.id;
      editInfillDevelopment(editedInfillDevelopment);
    }
  };
  destroyAllForms = () => {
    const {
      destroy
    } = this.props;
    destroy(FormNames.INFILL_DEVELOPMENT);
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

  render() {
    const {
      infillDevelopmentAttributes,
      infillDevelopmentMethods,
      isEditMode,
      isFetching,
      isFetchingInfillDevelopmentPageAttributes,
      isFetchingUsersPermissions,
      isFormValid,
      isInfillDevelopmentFormDirty,
      isSaveClicked,
      isSaving,
      usersPermissions
    } = this.props;
    const {
      activeTab
    } = this.state;
    const {
      formatedInfillDevelopment,
      isRestoreModalOpen
    } = this.state;
    if (isFetching || isFetchingInfillDevelopmentPageAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!infillDevelopmentMethods || isEmpty(usersPermissions)) return null;
    if (!isMethodAllowed(infillDevelopmentMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.INFILL_DEVELOPMENT} /></PageContainer>;
    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowCopy={isMethodAllowed(infillDevelopmentMethods, Methods.POST)} allowEdit={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)} isCancelDisabled={false} isCopyDisabled={false} isEditDisabled={false} isEditMode={isEditMode} isSaveDisabled={isSaveClicked && !isFormValid} onCancel={this.cancelChanges} onCopy={this.copyInfillDevelopment} onEdit={this.handleShowEditMode} onSave={this.saveChanges} showCommentButton={false} showCopyButton={true} />} infoComponent={<h1>{formatedInfillDevelopment.name}</h1>} onBack={this.handleBack} />

          <Tabs active={activeTab} isEditMode={isEditMode} tabs={[{
          label: InfillDevelopmentCompensationFieldTitles.BASIC_INFO,
          allow: true,
          isDirty: isInfillDevelopmentFormDirty,
          hasError: isSaveClicked && !isFormValid
        }, {
          label: InfillDevelopmentCompensationFieldTitles.MAP,
          allow: isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)
        }]} onTabClick={this.handleTabClick} />
        </PageNavigationWrapper>

        <PageContainer className='with-small-control-bar-and-tabs' hasTabs>
          {isSaving && <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>}

          <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)}>
            <ConfirmationModal confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON} isOpen={isRestoreModalOpen} label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL} onCancel={this.cancelRestoreUnsavedChanges} onClose={this.cancelRestoreUnsavedChanges} onSave={this.restoreUnsavedChanges} title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE} />
          </Authorization>


          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.BASIC_INFO)}>
                  {InfillDevelopmentCompensationFieldTitles.BASIC_INFO}
                </Title>
                <Divider />

                {isEditMode ? <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)} errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}>
                    <InfillDevelopmentForm infillDevelopment={formatedInfillDevelopment} />
                  </Authorization> : <InfillDevelopmentTemplate infillDevelopment={formatedInfillDevelopment} />}
              </ContentContainer>
            </TabPane>
            <TabPane>
              <ContentContainer>
                <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)} errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}>
                  <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationFieldPaths.MAP)}>
                    {InfillDevelopmentCompensationFieldTitles.MAP}
                  </Title>
                  <Divider />

                  <SingleInfillDevelopmentMap />
                </Authorization>
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>;
  }

}

export default flowRight(withUiDataList, withInfillDevelopmentPageAttributes, connect(state => {
  return {
    currentInfillDevelopment: getCurrentInfillDevelopment(state),
    infillDevelopmentFormValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
    isInfillDevelopmentFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  change,
  clearFormValidFlags,
  destroy,
  editInfillDevelopment,
  fetchSingleInfillDevelopment,
  hideEditMode,
  receiveFormInitialValues,
  receiveSingleInfillDevelopment,
  receiveIsSaveClicked,
  receiveTopNavigationSettings,
  showEditMode
}), withRouter)(InfillDevelopmentPage);