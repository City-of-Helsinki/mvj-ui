// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
import EditableMap from '$src/areaNote/components/EditableMap';
import Invoices from './sections/Invoices';
import InvoicesEdit from './sections/InvoicesEdit';
import PageContainer from '$components/content/PageContainer';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  clearFormValidFlags,
  editLandUseContract,
  fetchLandUseContractAttributes,
  fetchSingleLandUseContract,
  hideEditMode,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {
  clearUnsavedChanges,
  getContentLandUseContractIdentifier,
  getContentBasicInformation,
  getContentCompensations,
  getContentContracts,
  getContentDecisions,
  getContentInvoices,
} from '$src/landUseContract/helpers';
import {getRouteById} from '$src/root/routes';
import {
  getAttributes,
  getCurrentLandUseContract,
  getIsEditMode,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsSaveClicked,
} from '$src/landUseContract/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  basicInformationFormValues: Object,
  change: Function,
  clearFormValidFlags: Function,
  compensationsFormValues: Object,
  contractsFormValues: Object,
  currentLandUseContract: LandUseContract,
  decisionsFormValues: Object,
  destroy: Function,
  editLandUseContract: Function,
  fetchLandUseContractAttributes: Function,
  fetchSingleLandUseContract: Function,
  hideEditMode: Function,
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
  isInvoicesFormDirty: boolean,
  isInvoicesFormValid: boolean,
  isEditMode: boolean,
  isFormValidFlags: boolean,
  isSaveClicked: boolean,
  location: Object,
  params: Object,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

type State = {
  activeTab: number,
  isCancelLeaseModalOpen: boolean,
  isRestoreModalOpen: boolean,
}

class LandUseContractPage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isCancelLeaseModalOpen: false,
    isRestoreModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  timerAutoSave: any

  componentDidMount() {
    const {
      attributes,
      clearFormValidFlags,
      fetchLandUseContractAttributes,
      fetchSingleLandUseContract,
      location,
      params: {landUseContractId},
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('landUseContract'),
      pageTitle: 'Maankäyttösopimukset',
      showSearch: false,
    });

    fetchSingleLandUseContract(landUseContractId);

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    if(isEmpty(attributes)) {
      fetchLandUseContractAttributes();
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);
  }

  componentDidUpdate(prevProps) {
    const {
      params: {landUseContractId},
    } = this.props;

    if(isEmpty(prevProps.currentLandUseContract) && !isEmpty(this.props.currentLandUseContract)) {
      const storedLandUseContractId = getSessionStorageItem('landUseContractId');
      if(Number(landUseContractId) === storedLandUseContractId) {
        this.setState({isRestoreModalOpen: true});
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !this.props.isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }

  componentWillUnmount() {
    const {
      hideEditMode,
      params: {landUseContractId},
      router: {location: {pathname}},
    } = this.props;

    hideEditMode();

    if(pathname !== `${getRouteById('landUseContract')}/${landUseContractId}`) {
      clearUnsavedChanges();
    }
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
      params: {landUseContractId},
    } = this.props;

    let isDirty = false;

    if(isBasicInformationFormDirty) {
      setSessionStorageItem(FormNames.BASIC_INFORMATION, basicInformationFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.BASIC_INFORMATION);
    }

    if(isDecisionsFormDirty) {
      setSessionStorageItem(FormNames.DECISIONS, decisionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.DECISIONS);
    }

    if(isContractsFormDirty) {
      setSessionStorageItem(FormNames.CONTRACTS, contractsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.CONTRACTS);
    }

    if(isCompensationsFormDirty) {
      setSessionStorageItem(FormNames.COMPENSATIONS, compensationsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.COMPENSATIONS);
    }

    if(isInvoicesFormDirty) {
      setSessionStorageItem(FormNames.INVOICES, invoicesFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.INVOICES);
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
    const {clearFormValidFlags, currentLandUseContract, showEditMode} = this.props;

    showEditMode();
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentLandUseContract);

    const storedBasicInformationFormValues = getSessionStorageItem(FormNames.BASIC_INFORMATION);
    if(storedBasicInformationFormValues) {
      this.bulkChange(FormNames.BASIC_INFORMATION, storedBasicInformationFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(FormNames.DECISIONS);
    if(storedDecisionsFormValues) {
      this.bulkChange(FormNames.DECISIONS, storedDecisionsFormValues);
    }

    const storedContractsFormValues = getSessionStorageItem(FormNames.CONTRACTS);
    if(storedContractsFormValues) {
      this.bulkChange(FormNames.CONTRACTS, storedContractsFormValues);
    }

    const storedCompensationsFormValues = getSessionStorageItem(FormNames.COMPENSATIONS);
    if(storedCompensationsFormValues) {
      this.bulkChange(FormNames.COMPENSATIONS, storedCompensationsFormValues);
    }

    const storedInvoicesFormValues = getSessionStorageItem(FormNames.INVOICES);
    if(storedInvoicesFormValues) {
      this.bulkChange(FormNames.INVOICES, storedInvoicesFormValues);
    }

    const storedFormValidity = getSessionStorageItem('leaseValidity');
    if(storedFormValidity) {
      const {receiveFormValidFlags} = this.props;
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
    const {router} = this.context;
    const {location} = this.props;
    const {router: {location: {query}}} = this.props;


    this.setState({activeTab: tabId}, () => {
      query.tab = tabId;
      return router.push({
        ...location,
        query,
      });
    });
  }

  handleControlButtonBarBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: getRouteById('landUseContract'),
      query,
    });
  }

  handleControlButtonCancel = () => {
    const isDirty = this.isAnyFormDirty();
    if(isDirty) {
      this.showModal('CancelLease');
    } else {
      this.cancel();
    }
  }

  handleHideCancelConfirmation = () => {
    this.hideModal('CancelLease');
  }

  cancel = () => {
    const {hideEditMode} = this.props;

    this.hideModal('CancelLease');
    hideEditMode();
  }

  handleControlButtonEdit = () => {
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

    initialize(FormNames.BASIC_INFORMATION, getContentBasicInformation(landUseContract));
    initialize(FormNames.DECISIONS, {decisions: getContentDecisions(landUseContract)});
    initialize(FormNames.CONTRACTS, {contracts: getContentContracts(landUseContract)});
    initialize(FormNames.COMPENSATIONS, {compensations: getContentCompensations(landUseContract)});
    initialize(FormNames.INVOICES, {invoices: getContentInvoices(landUseContract)});
  }

  handleControlButtonSave = () => {
    const {receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.getAreFormsValid();
    if(areFormsValid) {
      this.save();
    }
  }

  getAreFormsValid = () => {
    const {
      isBasicInformationFormValid,
      isCompensationsFormValid,
      isContractsFormValid,
      isDecisionsFormValid,
      isInvoicesFormValid,
    } = this.props;

    return (
      isBasicInformationFormValid &&
      isCompensationsFormValid &&
      isContractsFormValid &&
      isDecisionsFormValid &&
      isInvoicesFormValid
    );
  }

  isAnyFormDirty = () => {
    const {
      isBasicInformationFormDirty,
      isCompensationsFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInvoicesFormDirty,
    } = this.props;

    return (
      isBasicInformationFormDirty ||
      isCompensationsFormDirty ||
      isContractsFormDirty ||
      isDecisionsFormDirty ||
      isInvoicesFormDirty
    );
  }

  save = () => {
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

    payload.identifier = currentLandUseContract.identifier;
    editLandUseContract(payload);
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

    destroy(FormNames.BASIC_INFORMATION);
    destroy(FormNames.DECISIONS);
    destroy(FormNames.CONTRACTS);
    destroy(FormNames.COMPENSATIONS);
    destroy(FormNames.INVOICES);
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
      isInvoicesFormDirty,
      isInvoicesFormValid,
      isEditMode,
      isSaveClicked,
    } = this.props;
    const {isCancelLeaseModalOpen, isRestoreModalOpen} = this.state;
    const identifier = getContentLandUseContractIdentifier(currentLandUseContract);
    const areFormsValid = this.getAreFormsValid();

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={this.handleHideCancelConfirmation}
          onClose={this.handleHideCancelConfirmation}
          onSave={this.cancel}
          title='Hylkää muutokset'
        />

        <ConfirmationModal
          confirmButtonLabel='Palauta muutokset'
          isOpen={isRestoreModalOpen}
          label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
          onCancel={this.cancelRestoreUnsavedChanges}
          onClose={this.cancelRestoreUnsavedChanges}
          onSave={this.restoreUnsavedChanges}
          title='Palauta tallentamattomat muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCancelDisabled={false}
              isCopyDisabled={true}
              isEditDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !areFormsValid}
              onCancelClick={this.handleControlButtonCancel}
              onEditClick={this.handleControlButtonEdit}
              onSaveClick={this.handleControlButtonSave}
              showCommentButton={false}
              showCopyButton={false}
            />
          }
          infoComponent={<h1>{identifier}</h1>}
          onBack={this.handleControlButtonBarBack}
        />

        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {label: 'Perustiedot', isDirty: isBasicInformationFormDirty, hasError: isSaveClicked && !isBasicInformationFormValid},
            {label: 'Päätökset ja sopimukset', isDirty: (isContractsFormDirty || isDecisionsFormDirty), hasError: isSaveClicked && (!isDecisionsFormValid || !isContractsFormValid)},
            {label: 'Korvaukset ja laskutus', isDirty: isCompensationsFormDirty || isInvoicesFormDirty, hasError: isSaveClicked && (!isCompensationsFormValid || !isInvoicesFormValid)},
            {label: 'Kartta'},
          ]}
          onTabClick={(id) => this.handleTabClick(id)}
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

              <h2>Laskutus</h2>
              <Divider />
              {!isEditMode
                ? <Invoices />
                : <InvoicesEdit />
              }
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <EditableMap
                showEditTools={false}
              />
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        basicInformationFormValues: getFormValues(FormNames.BASIC_INFORMATION)(state),
        compensationsFormValues: getFormValues(FormNames.COMPENSATIONS)(state),
        contractsFormValues: getFormValues(FormNames.CONTRACTS)(state),
        currentLandUseContract: getCurrentLandUseContract(state),
        decisionsFormValues: getFormValues(FormNames.DECISIONS)(state),
        invoicesFormValues: getFormValues(FormNames.INVOICES)(state),
        isBasicInformationFormDirty: isDirty(FormNames.BASIC_INFORMATION)(state),
        isBasicInformationFormValid: getIsFormValidById(state, FormNames.BASIC_INFORMATION),
        isCompensationsFormDirty: isDirty(FormNames.COMPENSATIONS)(state),
        isCompensationsFormValid: getIsFormValidById(state, FormNames.COMPENSATIONS),
        isContractsFormDirty: isDirty(FormNames.CONTRACTS)(state),
        isContractsFormValid: getIsFormValidById(state, FormNames.CONTRACTS),
        isDecisionsFormDirty: isDirty(FormNames.DECISIONS)(state),
        isDecisionsFormValid: getIsFormValidById(state, FormNames.DECISIONS),
        isInvoicesFormDirty: isDirty(FormNames.INVOICES)(state),
        isInvoicesFormValid: getIsFormValidById(state, FormNames.INVOICES),
        isEditMode: getIsEditMode(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      editLandUseContract,
      fetchLandUseContractAttributes,
      fetchSingleLandUseContract,
      hideEditMode,
      initialize,
      receiveFormValidFlags,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LandUseContractPage);
