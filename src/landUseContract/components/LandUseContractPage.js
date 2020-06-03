// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {change, destroy, getFormValues, initialize, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import BasicInformation from './sections/BasicInformation';
import BasicInformationEdit from './sections/BasicInformationEdit';
import Compensations from './sections/Compensations';
import CompensationsEdit from './sections/CompensationsEdit';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import Contracts from './sections/Contracts';
import ContractsEdit from './sections/ContractsEdit';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import Decisions from './sections/Decisions';
import DecisionsEdit from './sections/DecisionsEdit';
import Divider from '$components/content/Divider';
import FullWidthContainer from '$components/content/FullWidthContainer';
import InvoicesR from './sections/InvoicesR';
// import Invoices from './sections/Invoices';
// import InvoicesEdit from './sections/InvoicesEdit';
import LandUseContractMap from './sections/LandUseContractMap';
import Litigants from './sections/Litigants';
import LitigantsEdit from './sections/LitigantsEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  clearFormValidFlags,
  editLandUseContract,
  fetchSingleLandUseContract,
  hideEditMode,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  receiveSingleLandUseContract,
  showEditMode,
} from '$src/landUseContract/actions';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {
  addLitigantsFormValuesToPayload,
  clearUnsavedChanges,
  getContentLandUseContractIdentifier,
  getContentBasicInformation,
  getContentCompensations,
  getContentContracts,
  getContentDecisions,
  getContentInvoices,
  getContentLitigants,
} from '$src/landUseContract/helpers';
import {getSearchQuery, getUrlParams, isArchived, scrollToTopPage, setPageTitle} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {
  getCurrentLandUseContract,
  getIsEditMode,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsSaveClicked,
} from '$src/landUseContract/selectors';
import {getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions} from '$src/usersPermissions/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {withLandUseContractAttributes} from '$components/attributes/LandUseContractAttributes';

import type {Attributes} from '$src/types';
import type {LandUseContract} from '$src/landUseContract/types';
import type {UsersPermissions} from '$src/usersPermissions/types';

type Props = {
  basicInformationFormValues: Object,
  change: Function,
  clearFormValidFlags: Function,
  compensationsFormValues: Object,
  contractsFormValues: Object,
  currentLandUseContract: LandUseContract,
  decisionsFormValues: Object,
  destroy: Function,
  editLandUseContract: Function,
  fetchSingleLandUseContract: Function,
  hideEditMode: Function,
  history: Object,
  initialize: Function,
  invoicesFormValues: Object,
  isBasicInformationFormDirty: boolean,
  isBasicInformationFormValid: boolean,
  isCompensationsFormDirty: boolean,
  isCompensationsFormValid: boolean,
  isContractsFormDirty: boolean,
  isContractsFormValid: boolean,
  isDecisionsFormDirty: boolean,
  isDecisionsFormValid: boolean,
  isEditMode: boolean,
  isFetchingLandUseContractAttributes: boolean,
  isFetchingUsersPermissions: boolean,
  isFormValidFlags: boolean,
  isInvoicesFormDirty: boolean,
  isInvoicesFormValid: boolean,
  isLitigantsFormDirty: boolean,
  isLitigantsFormValid: boolean,
  isSaveClicked: boolean,
  landUseContractAttributes: Attributes,
  litigantsFormValues: Object,
  location: Object,
  match: {
    params: Object,
  },
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  receiveSingleLandUseContract: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
  usersPermissions: UsersPermissions,
}

type State = {
  activeTab: number,
  isRestoreModalOpen: boolean,
}

class LandUseContractPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isRestoreModalOpen: false,
  }

  timerAutoSave: any

  componentDidMount() {
    const {
      clearFormValidFlags,
      fetchSingleLandUseContract,
      hideEditMode,
      location: {search},
      match: {params: {landUseContractId}},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    this.setPageTitle();

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LAND_USE_CONTRACTS),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    fetchSingleLandUseContract(landUseContractId);

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    hideEditMode();

    window.addEventListener('beforeunload', this.handleLeavePage);
    window.addEventListener('popstate', this.handlePopState);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      currentLandUseContract,
      isEditMode,
      match: {params: {landUseContractId}},
    } = this.props;
    const {activeTab} = this.state;

    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    if(prevProps.currentLandUseContract !== currentLandUseContract) {
      this.setPageTitle();
    }

    if(isEmpty(prevProps.currentLandUseContract) && !isEmpty(currentLandUseContract)) {
      const storedLandUseContractId = getSessionStorageItem('landUseContractId');

      if(Number(landUseContractId) === storedLandUseContractId) {
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
      match: {params: {landUseContractId}},
      receiveSingleLandUseContract,
    } = this.props;

    if(pathname !== `${getRouteById(Routes.LAND_USE_CONTRACTS)}/${landUseContractId}`) {
      clearUnsavedChanges();
    }

    // Clear current land use contract
    receiveSingleLandUseContract({});

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

  setPageTitle = () => {
    const {currentLandUseContract} = this.props;
    const identifier = getContentLandUseContractIdentifier(currentLandUseContract);

    setPageTitle(`${identifier
      ? `${identifier} | `
      : ''}Maankäyttösopimus`);
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
    const {isEditMode} = this.props;

    if(this.isAnyFormDirty() && isEditMode) {
      const confirmationMessage = '';

      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  saveUnsavedChanges = () => {
    const {
      basicInformationFormValues,
      compensationsFormValues,
      contractsFormValues,
      decisionsFormValues,
      invoicesFormValues,
      isBasicInformationFormDirty,
      isCompensationsFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInvoicesFormDirty,
      isFormValidFlags,
      isLitigantsFormDirty,
      litigantsFormValues,
      match: {params: {landUseContractId}},
    } = this.props;

    let isDirty = false;

    if(isBasicInformationFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION);
    }

    if(isDecisionsFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_DECISIONS, decisionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_DECISIONS);
    }

    if(isContractsFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_CONTRACTS, contractsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_CONTRACTS);
    }

    if(isCompensationsFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_COMPENSATIONS, compensationsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_COMPENSATIONS);
    }

    if(isInvoicesFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_INVOICES, invoicesFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_INVOICES);
    }

    if(isLitigantsFormDirty) {
      setSessionStorageItem(FormNames.LAND_USE_CONTRACT_LITIGANTS, litigantsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LAND_USE_CONTRACT_LITIGANTS);
    }

    if(isDirty) {
      setSessionStorageItem('landUseContractId', landUseContractId);
      setSessionStorageItem('landUseContractValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('landUseContractId');
      removeSessionStorageItem('landUseContractValidity');
    }
  };

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.hideModal('Restore');
  }

  restoreUnsavedChanges = () => {
    const {
      clearFormValidFlags,
      currentLandUseContract,
      receiveFormValidFlags,
      showEditMode,
    } = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentLandUseContract);

    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION);
    if(storedBasicInformationFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION, storedBasicInformationFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_DECISIONS);
    if(storedDecisionsFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_DECISIONS, storedDecisionsFormValues);
    }

    const storedContractsFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_CONTRACTS);
    if(storedContractsFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_CONTRACTS, storedContractsFormValues);
    }

    const storedCompensationsFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_COMPENSATIONS);
    if(storedCompensationsFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_COMPENSATIONS, storedCompensationsFormValues);
    }

    const storedInvoicesFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_INVOICES);
    if(storedInvoicesFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_INVOICES, storedInvoicesFormValues);
    }

    const storedLitigantsFormValues = getSessionStorageItem(FormNames.LAND_USE_CONTRACT_LITIGANTS);
    if(storedLitigantsFormValues) {
      this.bulkChange(FormNames.LAND_USE_CONTRACT_LITIGANTS, storedLitigantsFormValues);
    }

    const storedFormValidity = getSessionStorageItem('leaseValidity');
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

  handleTabClick = (tabId: number) => {
    const {history, location, location: {search}} = this.props;
    const query = getUrlParams(search);

    this.setState({activeTab: tabId}, () => {
      query.tab = tabId;

      return history.push({
        ...location,
        search: getSearchQuery(query),
      });
    });
  }

  handleBack = () => {
    const {history, location: {search}} = this.props;
    const query = getUrlParams(search);

    // Remove page specific url parameters when moving to lease list page
    delete query.tab;

    return history.push({
      pathname: getRouteById(Routes.LAND_USE_CONTRACTS),
      search: getSearchQuery(query),
    });
  }

  handleShowEditMode = () => {
    const {clearFormValidFlags, currentLandUseContract, receiveIsSaveClicked, showEditMode} = this.props;

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    showEditMode();
    this.destroyAllForms();
    this.initializeForms(currentLandUseContract);
    this.startAutoSaveTimer();
  }

  initializeForms = (landUseContract: LandUseContract) => {
    const {initialize} = this.props;
    const litigants = getContentLitigants(landUseContract);

    initialize(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION, getContentBasicInformation(landUseContract));
    initialize(FormNames.LAND_USE_CONTRACT_LITIGANTS, {
      activeLitigants: litigants.filter((litigant) => !isArchived(litigant.litigant)),
      archivedLitigants: litigants.filter((litigant) => isArchived(litigant.litigant)),
    });
    initialize(FormNames.LAND_USE_CONTRACT_DECISIONS, {decisions: getContentDecisions(landUseContract)});
    initialize(FormNames.LAND_USE_CONTRACT_CONTRACTS, {contracts: getContentContracts(landUseContract)});
    initialize(FormNames.LAND_USE_CONTRACT_COMPENSATIONS, {compensations: getContentCompensations(landUseContract)});
    initialize(FormNames.LAND_USE_CONTRACT_INVOICES, {invoices: getContentInvoices(landUseContract)});
  }

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    this.hideModal('CancelLease');
    hideEditMode();
  }

  saveChanges = () => {
    const {receiveIsSaveClicked} = this.props;
    const areFormsValid = this.getAreFormsValid();

    receiveIsSaveClicked(true);

    if(areFormsValid) {
      const {
        basicInformationFormValues,
        compensationsFormValues,
        contractsFormValues,
        currentLandUseContract,
        decisionsFormValues,
        editLandUseContract,
        invoicesFormValues,
        isBasicInformationFormDirty,
        isCompensationsFormDirty,
        isContractsFormDirty,
        isDecisionsFormDirty,
        isInvoicesFormDirty,
        isLitigantsFormDirty,
        litigantsFormValues,
      } = this.props;

      //TODO: Add helper functions to save land use contract to DB when API is ready
      let payload: Object = {...currentLandUseContract};

      if(isBasicInformationFormDirty) {
        payload = {...payload, ...basicInformationFormValues};
      }

      if(isDecisionsFormDirty) {
        payload = {...payload, ...decisionsFormValues};
      }

      if(isContractsFormDirty) {
        payload = {...payload, ...contractsFormValues};
      }

      if(isCompensationsFormDirty) {
        payload = {...payload, ...compensationsFormValues};
      }

      if(isInvoicesFormDirty) {
        payload = {...payload, ...invoicesFormValues};
      }

      if(isLitigantsFormDirty) {
        payload = addLitigantsFormValuesToPayload(payload, litigantsFormValues);
      }

      payload.identifier = currentLandUseContract.identifier;
      editLandUseContract(payload);
    }
  }

  getAreFormsValid = () => {
    const {
      isBasicInformationFormValid,
      isCompensationsFormValid,
      isContractsFormValid,
      isDecisionsFormValid,
      isInvoicesFormValid,
      isLitigantsFormValid,
    } = this.props;

    return (
      isBasicInformationFormValid &&
      isCompensationsFormValid &&
      isContractsFormValid &&
      isDecisionsFormValid &&
      isInvoicesFormValid &&
      isLitigantsFormValid
    );
  }

  isAnyFormDirty = () => {
    const {
      isBasicInformationFormDirty,
      isCompensationsFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInvoicesFormDirty,
      isLitigantsFormDirty,
    } = this.props;

    return (
      isBasicInformationFormDirty ||
      isCompensationsFormDirty ||
      isContractsFormDirty ||
      isDecisionsFormDirty ||
      isInvoicesFormDirty ||
      isLitigantsFormDirty
    );
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

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION);
    destroy(FormNames.LAND_USE_CONTRACT_DECISIONS);
    destroy(FormNames.LAND_USE_CONTRACT_CONTRACTS);
    destroy(FormNames.LAND_USE_CONTRACT_COMPENSATIONS);
    destroy(FormNames.LAND_USE_CONTRACT_INVOICES);
    destroy(FormNames.LAND_USE_CONTRACT_LITIGANTS);
  }

  render() {
    const {activeTab} = this.state;
    const {
      currentLandUseContract,
      isBasicInformationFormDirty,
      isBasicInformationFormValid,
      isCompensationsFormDirty,
      isCompensationsFormValid,
      isContractsFormDirty,
      isContractsFormValid,
      isDecisionsFormDirty,
      isDecisionsFormValid,
      isFetchingLandUseContractAttributes,
      isFetchingUsersPermissions,
      isInvoicesFormDirty,
      isInvoicesFormValid,
      isEditMode,
      isLitigantsFormDirty,
      isLitigantsFormValid,
      isSaveClicked,
      landUseContractAttributes,
      usersPermissions,
    } = this.props;
    const {isRestoreModalOpen} = this.state;
    const identifier = getContentLandUseContractIdentifier(currentLandUseContract);
    const areFormsValid = this.getAreFormsValid();

    if(isFetchingLandUseContractAttributes || isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!landUseContractAttributes || isEmpty(usersPermissions)) return null;

    return (
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
            infoComponent={<h1>{identifier}</h1>}
            onBack={this.handleBack}
          />
          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {label: 'Perustiedot', allow: true, isDirty: isBasicInformationFormDirty, hasError: isSaveClicked && !isBasicInformationFormValid},
              {label: 'Osapuolet', allow: true, isDirty: isLitigantsFormDirty, hasError: isSaveClicked && !isLitigantsFormValid},
              {label: 'Päätökset ja sopimukset', allow: true, isDirty: (isContractsFormDirty || isDecisionsFormDirty), hasError: isSaveClicked && (!isDecisionsFormValid || !isContractsFormValid)},
              {label: 'Korvaukset', allow: true, isDirty: isCompensationsFormDirty, hasError: isSaveClicked && !isCompensationsFormValid},
              {label: 'Laskutus', allow: true, isDirty: isInvoicesFormDirty, hasError: isSaveClicked && !isInvoicesFormValid},
              {label: 'Kartta', allow: true},
              {label: 'Valvottavat ehdot', allow: true},
            ]}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </PageNavigationWrapper>

        <PageContainer className='with-small-control-bar-and-tabs' hasTabs>
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
                {!isEditMode
                  ? <BasicInformation />
                  : <BasicInformationEdit />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <h2>Osapuolet</h2>
                <Divider />
                {!isEditMode
                  ? <Litigants />
                  : <LitigantsEdit />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <h2>Päätökset</h2>
                <Divider />
                {!isEditMode
                  ? <Decisions />
                  : <DecisionsEdit />
                }

                <h2>Sopimukset</h2>
                <Divider />
                {!isEditMode
                  ? <Contracts />
                  : <ContractsEdit />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <h2>Korvaukset</h2>
                <Divider />
                {!isEditMode
                  ? <Compensations />
                  : <CompensationsEdit />
                }
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <InvoicesR />
                {/* <h2>Laskutus</h2>
                <Divider />
                {!isEditMode
                  ? <Invoices />
                  : <InvoicesEdit />
                } */}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <LandUseContractMap />
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <h2>Valvottavat ehdot</h2>
                <Divider />
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
  withLandUseContractAttributes,
  connect(
    (state) => {
      return {
        basicInformationFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION)(state),
        compensationsFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_COMPENSATIONS)(state),
        contractsFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_CONTRACTS)(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        decisionsFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_DECISIONS)(state),
        invoicesFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_INVOICES)(state),
        isBasicInformationFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION)(state),
        isBasicInformationFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION),
        isCompensationsFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_COMPENSATIONS)(state),
        isCompensationsFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_COMPENSATIONS),
        isContractsFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_CONTRACTS)(state),
        isContractsFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_CONTRACTS),
        isDecisionsFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_DECISIONS)(state),
        isDecisionsFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_DECISIONS),
        isEditMode: getIsEditMode(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isInvoicesFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_INVOICES)(state),
        isInvoicesFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_INVOICES),
        isLitigantsFormDirty: isDirty(FormNames.LAND_USE_CONTRACT_LITIGANTS)(state),
        isLitigantsFormValid: getIsFormValidById(state, FormNames.LAND_USE_CONTRACT_LITIGANTS),
        isSaveClicked: getIsSaveClicked(state),
        litigantsFormValues: getFormValues(FormNames.LAND_USE_CONTRACT_LITIGANTS)(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      editLandUseContract,
      fetchSingleLandUseContract,
      hideEditMode,
      initialize,
      receiveFormValidFlags,
      receiveIsSaveClicked,
      receiveSingleLandUseContract,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LandUseContractPage);
