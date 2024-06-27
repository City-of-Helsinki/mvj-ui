import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { change, getFormValues, isDirty } from "redux-form";
import isEmpty from "lodash/isEmpty";
import flowRight from "lodash/flowRight";
import Authorization from "/src/components/authorization/Authorization";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import ConfirmationModal from "/src/components/modal/ConfirmationModal";
import ContentContainer from "/src/components/content/ContentContainer";
import ControlButtonBar from "/src/components/controlButtons/ControlButtonBar";
import ControlButtons from "/src/components/controlButtons/ControlButtons";
import Divider from "/src/components/content/Divider";
import FullWidthContainer from "/src/components/content/FullWidthContainer";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import PageContainer from "/src/components/content/PageContainer";
import PageNavigationWrapper from "/src/components/content/PageNavigationWrapper";
import RentBasisEdit from "./sections/basicInfo/RentBasisEdit";
import RentBasisInfo from "./RentBasisInfo";
import RentBasisReadonly from "./sections/basicInfo/RentBasisReadonly";
import SingleRentBasisMap from "./sections/map/SingleRentBasisMap";
import Tabs from "/src/components/tabs/Tabs";
import TabContent from "/src/components/tabs/TabContent";
import TabPane from "/src/components/tabs/TabPane";
import Title from "/src/components/content/Title";
import { editRentBasis, fetchSingleRentBasis, hideEditMode, initializeRentBasis, receiveIsSaveClicked, showEditMode } from "/src/rentbasis/actions";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { ConfirmationModalTexts, Methods, PermissionMissingTexts } from "enums";
import { getSearchQuery, getUrlParams, isFieldAllowedToRead, isMethodAllowed, scrollToTopPage, setPageTitle } from "util/helpers";
import { FormNames } from "enums";
import { RentBasisFieldPaths, RentBasisFieldTitles } from "/src/rentbasis/enums";
import { clearUnsavedChanges, getPayloadRentBasis, getCopyOfRentBasis, getContentRentBasis } from "/src/rentbasis/helpers";
import { getUiDataRentBasisKey } from "/src/uiData/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getIsEditMode, getIsFetching, getIsFormValid, getIsSaveClicked, getIsSaving, getRentBasis } from "/src/rentbasis/selectors";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "usersPermissions/selectors";
import { getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem } from "util/storage";
import { withRentBasisAttributes } from "/src/components/attributes/RentBasisAttributes";
import { withUiDataList } from "/src/components/uiData/UiDataListHOC";
import type { Attributes, Methods as MethodsType } from "types";
import type { RentBasis } from "/src/rentbasis/types";
import type { RootState } from "/src/root/types";
import type { UsersPermissions } from "usersPermissions/types";
type Props = {
  change: (...args: Array<any>) => any;
  editedRentBasis: Record<string, any>;
  editRentBasis: (...args: Array<any>) => any;
  fetchSingleRentBasis: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  initializeRentBasis: (...args: Array<any>) => any;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingRentBasisAttributes: boolean;
  // Get via withRentBasisAttributes HOC
  isFetchingUsersPermissions: boolean;
  isFormDirty: boolean;
  isFormValid: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  location: Record<string, any>;
  match: {
    params: Record<string, any>;
  };
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  rentBasisAttributes: Attributes;
  // Get via withRentBasisAttributes HOC
  rentBasisMethods: MethodsType;
  // Get via withRentBasisAttributes HOC
  rentBasisData: RentBasis;
  router: Record<string, any>;
  showEditMode: (...args: Array<any>) => any;
  usersPermissions: UsersPermissions;
};
type State = {
  activeTab: number;
  isCancelModalOpen: boolean;
  isRestoreModalOpen: boolean;
};

class RentBasisPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isCancelModalOpen: false,
    isRestoreModalOpen: false
  };
  static contextTypes = {
    router: PropTypes.object
  };
  timerAutoSave: any;

  componentDidMount() {
    const {
      fetchSingleRentBasis,
      hideEditMode,
      location: {
        search
      },
      match: {
        params: {
          rentBasisId
        }
      },
      receiveIsSaveClicked,
      receiveTopNavigationSettings
    } = this.props;
    const query = getUrlParams(search);
    setPageTitle(`${rentBasisId} | Vuokrausperiaate`);
    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperiaatteet',
      showSearch: false
    });

    if (query.tab) {
      this.setState({
        activeTab: query.tab
      });
    }

    fetchSingleRentBasis(rentBasisId);
    hideEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      match: {
        params: {
          rentBasisId
        }
      }
    } = this.props;

    if (isEmpty(prevProps.rentBasisData) && !isEmpty(this.props.rentBasisData)) {
      const storedContactId = getSessionStorageItem('rentBasisId');

      if (Number(rentBasisId) === storedContactId) {
        this.setState({
          isRestoreModalOpen: true
        });
      }
    }

    if (prevState.activeTab !== this.state.activeTab) {
      scrollToTopPage();
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      location: {
        pathname
      },
      match: {
        params: {
          rentBasisId
        }
      }
    } = this.props;
    hideEditMode();

    if (pathname !== `${getRouteById(Routes.RENT_BASIS)}/${rentBasisId}`) {
      clearUnsavedChanges();
    }

    this.stopAutoSaveTimer();
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
  handleLeavePage = e => {
    const {
      isEditMode,
      isFormDirty
    } = this.props;

    if (isFormDirty && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };
  startAutoSaveTimer = () => {
    this.timerAutoSave = setInterval(() => this.saveUnsavedChanges(), 5000);
  };
  stopAutoSaveTimer = () => {
    clearInterval(this.timerAutoSave);
  };
  saveUnsavedChanges = () => {
    const {
      editedRentBasis,
      isFormDirty,
      match: {
        params: {
          rentBasisId
        }
      }
    } = this.props;

    if (isFormDirty) {
      setSessionStorageItem(FormNames.RENT_BASIS, editedRentBasis);
      setSessionStorageItem('rentBasisId', rentBasisId);
    } else {
      removeSessionStorageItem(FormNames.RENT_BASIS);
      removeSessionStorageItem('rentBasisId');
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
      initializeRentBasis,
      rentBasisData,
      showEditMode
    } = this.props;
    showEditMode();
    initializeRentBasis(rentBasisData);
    setTimeout(() => {
      const storedFormValues = getSessionStorageItem(FormNames.RENT_BASIS);

      if (storedFormValues) {
        this.bulkChange(FormNames.RENT_BASIS, storedFormValues);
      }

      this.startAutoSaveTimer();
    }, 20);
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
  copyRentBasis = () => {
    const {
      history,
      initializeRentBasis,
      location: {
        search
      },
      rentBasisData
    } = this.props;
    const rentBasis = getCopyOfRentBasis(rentBasisData);
    initializeRentBasis(rentBasis);
    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: search
    });
  };
  saveChanges = () => {
    const {
      editRentBasis,
      editedRentBasis,
      isFormValid,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);

    if (isFormValid) {
      editRentBasis(getPayloadRentBasis(editedRentBasis));
    }
  };
  handleBack = () => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    const query = getUrlParams(search);
    // Remove page specific url parameters when moving to lease list page
    delete query.tab;
    return history.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: getSearchQuery(query)
    });
  };
  cancelChanges = () => {
    const {
      hideEditMode
    } = this.props;
    this.setState({
      isCancelModalOpen: false
    });
    hideEditMode();
  };
  showEditMode = () => {
    const {
      initializeRentBasis,
      rentBasisData,
      receiveIsSaveClicked,
      showEditMode
    } = this.props,
          rentBasis = getContentRentBasis(rentBasisData);
    receiveIsSaveClicked(false);
    initializeRentBasis(rentBasis);
    showEditMode();
    this.startAutoSaveTimer();
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
      isEditMode,
      isFetching,
      isFetchingRentBasisAttributes,
      isFetchingUsersPermissions,
      isFormDirty,
      isFormValid,
      isSaveClicked,
      isSaving,
      rentBasisData,
      rentBasisAttributes,
      rentBasisMethods,
      usersPermissions
    } = this.props;
    const {
      activeTab,
      isRestoreModalOpen
    } = this.state;
    const rentBasis = getContentRentBasis(rentBasisData);
    if (isFetching || isFetchingRentBasisAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!rentBasisMethods || isEmpty(usersPermissions)) return null;
    if (!isMethodAllowed(rentBasisMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.RENT_BASIS} /></PageContainer>;
    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowCopy={isMethodAllowed(rentBasisMethods, Methods.POST)} allowEdit={isMethodAllowed(rentBasisMethods, Methods.PATCH)} isCopyDisabled={false} isEditMode={isEditMode} isSaveDisabled={isSaveClicked && !isFormValid} onCancel={this.cancelChanges} onCopy={this.copyRentBasis} onEdit={this.showEditMode} onSave={this.saveChanges} showCommentButton={false} showCopyButton={true} />} infoComponent={<RentBasisInfo identifier={rentBasis.id} />} onBack={this.handleBack} />
          <Tabs active={activeTab} isEditMode={isEditMode} tabs={[{
          label: RentBasisFieldTitles.BASIC_INFO,
          allow: true,
          isDirty: isFormDirty,
          hasError: isSaveClicked && !isFormValid
        }, {
          label: RentBasisFieldTitles.MAP,
          allow: isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)
        }]} onTabClick={this.handleTabClick} />
        </PageNavigationWrapper>

        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          {isSaving && <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>}

          <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.PATCH)}>
            <ConfirmationModal confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON} isOpen={isRestoreModalOpen} label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL} onCancel={this.cancelRestoreUnsavedChanges} onClose={this.restoreUnsavedChanges} onSave={this.restoreUnsavedChanges} title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE} />
          </Authorization>


          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.BASIC_INFO)}>
                  {RentBasisFieldTitles.BASIC_INFO}
                </Title>
                <Divider />

                {isEditMode ? <Authorization allow={rentBasisMethods.PATCH} errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}>
                    <RentBasisEdit />
                  </Authorization> : <RentBasisReadonly rentBasis={rentBasis} />}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Authorization allow={isFieldAllowedToRead(rentBasisAttributes, RentBasisFieldPaths.GEOMETRY)} errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}>
                  <Title enableUiDataEdit={isEditMode} uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.MAP)}>
                    {RentBasisFieldTitles.MAP}
                  </Title>
                  <Divider />

                  <SingleRentBasisMap />
                </Authorization>
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>;
  }

}

const mapStateToProps = (state: RootState) => {
  return {
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isEditMode: getIsEditMode(state),
    isFetching: getIsFetching(state),
    isFetchingUsersPermission: getIsFetchingUsersPermissions(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state),
    rentBasisData: getRentBasis(state),
    usersPermissions: getUsersPermissions(state)
  };
};

export default flowRight(withRentBasisAttributes, withUiDataList, withRouter, connect(mapStateToProps, {
  change,
  editRentBasis,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  receiveIsSaveClicked,
  receiveTopNavigationSettings,
  showEditMode
}))(RentBasisPage);