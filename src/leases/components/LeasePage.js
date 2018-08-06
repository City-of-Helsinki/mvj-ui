// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, destroy, getFormValues, initialize, isDirty} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import CommentPanel from '$components/commentPanel/CommentPanel';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Constructability from './leaseSections/constructability/Constructability';
import ConstructabilityEdit from './leaseSections/constructability/ConstructabilityEdit';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import DecisionsMain from './leaseSections/contract/DecisionsMain';
import DecisionsMainEdit from './leaseSections/contract/DecisionsMainEdit';
import EditableMap from '$src/areaNote/components/EditableMap';
import Invoices from './leaseSections/invoice/Invoices';
import InvoicesEdit from './leaseSections/invoice/InvoicesEdit';
import LeaseAreas from './leaseSections/leaseArea/LeaseAreas';
import LeaseAreasEdit from './leaseSections/leaseArea/LeaseAreasEdit';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Rents from './leaseSections/rent/Rents';
import RentsEdit from './leaseSections/rent/RentsEdit';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import TenantsEdit from './leaseSections/tenant/TenantsEdit';
import Tenants from './leaseSections/tenant/Tenants';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {fetchAttributes as fetchCommentAttributes, fetchCommentsByLease} from '$src/comments/actions';
import {fetchAttributes as fetchContactAttributes} from '$src/contacts/actions';
import {fetchDecisionsByLease} from '$src/decision/actions';
import {fetchAttributes as fetchInvoiceAttributes, fetchInvoices} from '$src/invoices/actions';
import {fetchInvoiceSetsByLease} from '$src/invoiceSets/actions';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/leases/actions';
import {fetchNoticePeriods} from '$src/noticePeriod/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/leases/enums';
import {FormNames as ComponentFormNames} from '$components/enums';
import {clearUnsavedChanges} from '$src/leases/helpers';
import * as contentHelpers from '$src/leases/helpers';
import {getSearchQuery} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAreaNoteList} from '$src/areaNote/selectors';
import {getAttributes as getCommentAttributes, getCommentsByLease} from '$src/comments/selectors';
import {getAttributes as getContactAttributes} from '$src/contacts/selectors';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {
  getAttributes,
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';

import type {Attributes as CommentAttributes, CommentList} from '$src/comments/types';
import type {Attributes as ContactAttributes} from '$src/contacts/types';
import type {Attributes as InvoiceAttributes} from '$src/invoices/types';
import type {Attributes, Lease} from '$src/leases/types';
import type {AreaNoteList} from '$src/areaNote/types';

type Props = {
  areaNotes: AreaNoteList,
  areasFormValues: Object,
  attributes: Attributes,
  change: Function,
  clearFormValidFlags: Function,
  commentAttributes: CommentAttributes,
  comments: CommentList,
  contactAttributes: ContactAttributes,
  contractsFormValues: Object,
  constructabilityFormValues: Object,
  currentLease: Object,
  decisionsFormValues: Object,
  destroy: Function,
  fetchAreaNoteList: Function,
  fetchAttributes: Function,
  fetchCommentAttributes: Function,
  fetchCommentsByLease: Function,
  fetchContactAttributes: Function,
  fetchDecisionsByLease: Function,
  fetchInvoiceAttributes: Function,
  fetchInvoices: Function,
  fetchInvoiceSetsByLease: Function,
  fetchNoticePeriods: Function,
  fetchSingleLease: Function,
  hideEditMode: Function,
  initialize: Function,
  inspectionsFormValues: Object,
  invoiceAttributes: InvoiceAttributes,
  isEditMode: boolean,
  isFetching: boolean,
  isFormValidFlags: Object,
  isConstructabilityFormDirty: boolean,
  isConstructabilityFormValid: boolean,
  isContractsFormDirty: boolean,
  isContractsFormValid: boolean,
  isDecisionsFormDirty: boolean,
  isDecisionsFormValid: boolean,
  isInspectionsFormDirty: boolean,
  isInspectionsFormValid: boolean,
  isLeaseAreasFormDirty: boolean,
  isLeaseAreasFormValid: boolean,
  isLeaseInfoFormDirty: boolean,
  isLeaseInfoFormValid: boolean,
  isRentsFormDirty: boolean,
  isRentsFormValid: boolean,
  isSummaryFormDirty: boolean,
  isSummaryFormValid: boolean,
  isTenantsFormDirty: boolean,
  isTenantsFormValid: boolean,
  isSaveClicked: boolean,
  leaseInfoFormValues: Object,
  location: Object,
  params: Object,
  patchLease: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  rentsFormValues: Object,
  router: Object,
  showEditMode: Function,
  summaryFormValues: Object,
  tenantsFormValues: Object,
}

type State = {
  activeTab: number,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isRestoreModalOpen: boolean,
};

class LeasePage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isRestoreModalOpen: false,
  }

  timerAutoSave: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      attributes,
      commentAttributes,
      contactAttributes,
      fetchAreaNoteList,
      fetchAttributes,
      fetchCommentAttributes,
      fetchCommentsByLease,
      fetchContactAttributes,
      fetchDecisionsByLease,
      fetchInvoiceAttributes,
      fetchInvoices,
      fetchInvoiceSetsByLease,
      fetchNoticePeriods,
      fetchSingleLease,
      invoiceAttributes,
      location,
      params: {leaseId},
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    if(isEmpty(commentAttributes)) {
      fetchCommentAttributes();
    }

    if(isEmpty(contactAttributes)) {
      fetchContactAttributes();
    }

    if(isEmpty(invoiceAttributes)) {
      fetchInvoiceAttributes();
    }

    fetchSingleLease(leaseId);
    fetchCommentsByLease(leaseId);
    fetchDecisionsByLease(leaseId);
    fetchInvoices(getSearchQuery({lease: leaseId}));
    fetchInvoiceSetsByLease(leaseId);
    fetchNoticePeriods();
    fetchAreaNoteList();
  }

  componentDidUpdate(prevProps) {
    const {params: {leaseId}} = this.props;

    if(!isEmpty(prevProps.currentLease) && (prevProps.currentLease !== this.props.currentLease)) {
      const {fetchDecisionsByLease} = this.props;
      fetchDecisionsByLease(leaseId);
    }

    if(isEmpty(prevProps.currentLease) && !isEmpty(this.props.currentLease)) {
      const storedLeaseId = getSessionStorageItem('leaseId');
      if(Number(leaseId) === storedLeaseId) {
        this.setState({isRestoreModalOpen: true});
      }
    }
    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !this.props.isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {
      destroy,
      hideEditMode,
      params: {leaseId},
      router: {location: {pathname}},
    } = this.props;

    hideEditMode();
    if(pathname !== `${getRouteById('leases')}/${leaseId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    window.removeEventListener('beforeunload', this.handleLeavePage);
    destroy(ComponentFormNames.RENT_CALCULATOR);
  }

  handleLeavePage = (e) => {
    const {isEditMode} = this.props;
    if(this.isAnyFormDirty() && isEditMode) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
    });
  }

  openEditMode = () => {
    const {clearFormValidFlags, currentLease, receiveIsSaveClicked, showEditMode} = this.props;

    receiveIsSaveClicked(false);
    clearFormValidFlags();

    this.destroyAllForms();
    this.initializeForms(currentLease);
    showEditMode();
    this.startAutoSaveTimer();
  }

  hideEditMode = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
    this.stopAutoSaveTimer();
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy(FormNames.CONSTRUCTABILITY);
    destroy(FormNames.CONTRACTS);
    destroy(FormNames.DECISIONS);
    destroy(FormNames.INSPECTIONS);
    destroy(FormNames.LEASE_AREAS);
    destroy(FormNames.LEASE_INFO);
    destroy(FormNames.RENTS);
    destroy(FormNames.SUMMARY);
    destroy(FormNames.TENANTS);
  }

  initializeForms = (lease: Lease) => {
    const {initialize} = this.props;

    initialize(FormNames.CONSTRUCTABILITY, {lease_areas: contentHelpers.getContentConstructability(lease)});
    initialize(FormNames.CONTRACTS, {contracts: contentHelpers.getContentContracts(lease)});
    initialize(FormNames.DECISIONS, {decisions: contentHelpers.getContentDecisions(lease)});
    initialize(FormNames.INSPECTIONS, {inspections: contentHelpers.getContentInspections(lease)});
    initialize(FormNames.LEASE_AREAS, {lease_areas: contentHelpers.getContentLeaseAreas(lease)});
    initialize(FormNames.LEASE_INFO, contentHelpers.getContentLeaseInfo(lease));
    initialize(FormNames.RENTS, {
      basis_of_rents: contentHelpers.getContentBasisOfRents(lease),
      is_rent_info_complete: lease.is_rent_info_complete,
      rents: contentHelpers.getContentRentsFormData(lease),
    });
    initialize(FormNames.SUMMARY, contentHelpers.getContentSummary(lease));
    initialize(FormNames.TENANTS, {tenants: contentHelpers.getContentTenantsFormData(lease)});
  }

  cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    this.hideModal('Restore');
  }

  restoreUnsavedChanges = () => {
    const {clearFormValidFlags, currentLease, showEditMode} = this.props;
    this.destroyAllForms();
    clearFormValidFlags();
    showEditMode();
    this.initializeForms(currentLease);

    const storedAreasFormValues = getSessionStorageItem(FormNames.LEASE_AREAS);
    if(storedAreasFormValues) {
      this.bulkChange(FormNames.LEASE_AREAS, storedAreasFormValues);
    }

    const storedConstructabilityFormValues = getSessionStorageItem(FormNames.CONSTRUCTABILITY);
    if(storedConstructabilityFormValues) {
      this.bulkChange(FormNames.CONSTRUCTABILITY, storedConstructabilityFormValues);
    }

    const storedContractsFormValues = getSessionStorageItem(FormNames.CONTRACTS);
    if(storedContractsFormValues) {
      this.bulkChange(FormNames.CONTRACTS, storedContractsFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(FormNames.DECISIONS);
    if(storedDecisionsFormValues) {
      this.bulkChange(FormNames.DECISIONS, storedDecisionsFormValues);
    }

    const storedInspectionsFormValues = getSessionStorageItem(FormNames.INSPECTIONS);
    if(storedInspectionsFormValues) {
      this.bulkChange(FormNames.INSPECTIONS, storedInspectionsFormValues);
    }

    const storedLeaseInfoFormValues = getSessionStorageItem(FormNames.LEASE_INFO);
    if(storedLeaseInfoFormValues) {
      this.bulkChange(FormNames.LEASE_INFO, storedLeaseInfoFormValues);
    }

    const storedRentsFormValues = getSessionStorageItem(FormNames.RENTS);
    if(storedRentsFormValues) {
      this.bulkChange(FormNames.RENTS, storedRentsFormValues);
    }

    const storedSummaryFormValues = getSessionStorageItem(FormNames.SUMMARY);
    if(storedSummaryFormValues) {
      this.bulkChange(FormNames.SUMMARY, storedSummaryFormValues);
    }

    const storedTenantsFormValues = getSessionStorageItem(FormNames.TENANTS);
    if(storedTenantsFormValues) {
      this.bulkChange(FormNames.TENANTS, storedTenantsFormValues);
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

  cancel = () => {
    const {hideEditMode} = this.props;
    this.hideModal('CancelLease');
    hideEditMode();
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
      areasFormValues,
      constructabilityFormValues,
      contractsFormValues,
      decisionsFormValues,
      inspectionsFormValues,
      isConstructabilityFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInspectionsFormDirty,
      isLeaseAreasFormDirty,
      isLeaseInfoFormDirty,
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
      isFormValidFlags,
      leaseInfoFormValues,
      params: {leaseId},
      rentsFormValues,
      summaryFormValues,
      tenantsFormValues,

    } = this.props;
    let isDirty = false;

    if(isConstructabilityFormDirty) {
      setSessionStorageItem(FormNames.CONSTRUCTABILITY, constructabilityFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.CONSTRUCTABILITY);
    }

    if(isContractsFormDirty) {
      setSessionStorageItem(FormNames.CONTRACTS, contractsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.CONTRACTS);
    }

    if(isDecisionsFormDirty) {
      setSessionStorageItem(FormNames.DECISIONS, decisionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.DECISIONS);
    }

    if(isInspectionsFormDirty) {
      setSessionStorageItem(FormNames.INSPECTIONS, inspectionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.INSPECTIONS);
    }

    if(isLeaseAreasFormDirty) {
      setSessionStorageItem(FormNames.LEASE_AREAS, areasFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREAS);
    }

    if(isLeaseInfoFormDirty) {
      setSessionStorageItem(FormNames.LEASE_INFO, leaseInfoFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_INFO);
    }

    if(isRentsFormDirty) {
      setSessionStorageItem(FormNames.RENTS, rentsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.RENTS);
    }

    if(isSummaryFormDirty) {
      setSessionStorageItem(FormNames.SUMMARY, summaryFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.SUMMARY);
    }

    if(isTenantsFormDirty) {
      setSessionStorageItem(FormNames.TENANTS, tenantsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.TENANTS);
    }

    if(isDirty) {
      setSessionStorageItem('leaseId', leaseId);
      setSessionStorageItem('leaseValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('leaseId');
      removeSessionStorageItem('leaseValidity');
    }
  };

  handleSaveClick = () => {
    const {receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.validateForms();
    if(areFormsValid) {
      this.save();
    }
  }

  save = () => {
    const {
      areasFormValues,
      constructabilityFormValues,
      contractsFormValues,
      currentLease,
      decisionsFormValues,
      inspectionsFormValues,
      leaseInfoFormValues,
      patchLease,
      rentsFormValues,
      summaryFormValues,
      tenantsFormValues,
      isConstructabilityFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInspectionsFormDirty,
      isLeaseAreasFormDirty,
      isLeaseInfoFormDirty,
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
    } = this.props;

    let payload: Object = {id: currentLease.id};

    if(isConstructabilityFormDirty) {
      payload = contentHelpers.addConstructabilityFormValues(payload, constructabilityFormValues);
    }
    if(isContractsFormDirty) {
      payload = contentHelpers.addContractsFormValues(payload, contractsFormValues);
    }
    if(isDecisionsFormDirty) {
      payload = contentHelpers.addDecisionsFormValues(payload, decisionsFormValues);
    }
    if(isInspectionsFormDirty) {
      payload = contentHelpers.addInspectionsFormValues(payload, inspectionsFormValues);
    }
    if(isLeaseAreasFormDirty) {
      payload = contentHelpers.addAreasFormValues(payload, areasFormValues);
    }
    if(isLeaseInfoFormDirty) {
      payload = contentHelpers.addLeaseInfoFormValues(payload, leaseInfoFormValues);
    }
    if(isRentsFormDirty) {
      payload = contentHelpers.addRentsFormValues(payload, rentsFormValues);
    }
    if(isSummaryFormDirty) {
      payload = contentHelpers.addSummaryFormValues(payload, summaryFormValues);
    }
    if(isTenantsFormDirty) {
      payload = contentHelpers.addTenantsFormValues(payload, tenantsFormValues);
    }

    patchLease(payload);
  }

  validateForms = () => {
    const {
      isConstructabilityFormValid,
      isContractsFormValid,
      isDecisionsFormValid,
      isInspectionsFormValid,
      isLeaseAreasFormValid,
      isLeaseInfoFormValid,
      isRentsFormValid,
      isSummaryFormValid,
      isTenantsFormValid,
    } = this.props;

    return (
      isConstructabilityFormValid &&
      isContractsFormValid &&
      isDecisionsFormValid &&
      isInspectionsFormValid &&
      isLeaseAreasFormValid &&
      isLeaseInfoFormValid &&
      isRentsFormValid &&
      isSummaryFormValid &&
      isTenantsFormValid
    );
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    query.tab = undefined;
    return router.push({
      pathname: `${getRouteById('leases')}`,
      query,
    });
  }

  handleTabClick = (tabId) => {
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
  };

  handleCancel = () => {
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

  toggleCommentPanel = () => {
    const {isCommentPanelOpen} = this.state;
    this.setState({isCommentPanelOpen: !isCommentPanelOpen});
  }

  isAnyFormDirty = () => {
    const {
      isConstructabilityFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInspectionsFormDirty,
      isLeaseAreasFormDirty,
      isLeaseInfoFormDirty,
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
    } = this.props;

    return (
      isConstructabilityFormDirty ||
      isContractsFormDirty ||
      isDecisionsFormDirty ||
      isInspectionsFormDirty ||
      isLeaseAreasFormDirty ||
      isLeaseInfoFormDirty ||
      isRentsFormDirty ||
      isSummaryFormDirty ||
      isTenantsFormDirty
    );
  }

  render() {
    const {
      activeTab,
      isCancelLeaseModalOpen,
      isCommentPanelOpen,
      isRestoreModalOpen,
    } = this.state;

    const {
      areaNotes,
      comments,
      currentLease,
      isEditMode,
      isFetching,
      isConstructabilityFormDirty,
      isConstructabilityFormValid,
      isContractsFormDirty,
      isContractsFormValid,
      isDecisionsFormDirty,
      isDecisionsFormValid,
      isInspectionsFormDirty,
      isInspectionsFormValid,
      isLeaseAreasFormDirty,
      isLeaseAreasFormValid,
      isRentsFormDirty,
      isRentsFormValid,
      isSummaryFormDirty,
      isSummaryFormValid,
      isTenantsFormDirty,
      isTenantsFormValid,
      isSaveClicked,
    } = this.props;

    const areFormsValid = this.validateForms();


    if(isFetching) {
      return (
        <PageContainer>
          <Loader isLoading={true} />
        </PageContainer>
      );
    }

    if(isEmpty(currentLease)) {
      return null;
    }

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

        <CommentPanel
          isOpen={isCommentPanelOpen}
          onClose={this.toggleCommentPanel}
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              commentAmount={comments ? comments.length : 0}
              isCancelDisabled={false}
              isEditDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && (!areFormsValid || activeTab === 6)}
              onCancelClick={this.handleCancel}
              onCommentClick={this.toggleCommentPanel}
              onEditClick={this.openEditMode}
              onSaveClick={this.handleSaveClick}
            />
          }
          infoComponent={isEditMode
            ? <LeaseInfoEdit />
            : <LeaseInfo />
          }
          onBack={this.handleBack}
        />

        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {label: 'Yhteenveto', isDirty: isSummaryFormDirty, hasError: isSaveClicked && !isSummaryFormValid},
            {label: 'Vuokra-alue', isDirty: isLeaseAreasFormDirty, hasError: isSaveClicked && !isLeaseAreasFormValid},
            {label: 'Vuokralaiset', isDirty: isTenantsFormDirty, hasError: isSaveClicked && !isTenantsFormValid},
            {label: 'Vuokrat', isDirty: isRentsFormDirty, hasError: isSaveClicked && !isRentsFormValid},
            {label: 'Päätökset ja sopimukset', isDirty: (isContractsFormDirty || isDecisionsFormDirty || isInspectionsFormDirty), hasError: isSaveClicked && (!isContractsFormValid || !isDecisionsFormValid || !isInspectionsFormValid)},
            {label: 'Rakentamiskelpoisuus', isDirty: isConstructabilityFormDirty, hasError: isSaveClicked && !isConstructabilityFormValid},
            {label: 'Laskutus'},
            {label: 'Kartta'},
          ]}
          onTabClick={(id) => this.handleTabClick(id)}
        />

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              {isEditMode
                ? <SummaryEdit />
                : <Summary />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <LeaseAreasEdit />
                : <LeaseAreas />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <TenantsEdit />
                : <Tenants />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <RentsEdit />
                : <Rents />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <DecisionsMainEdit />
                : <DecisionsMain />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <ConstructabilityEdit />
                : <Constructability />
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? <InvoicesEdit />
                : <Invoices />
              }
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <EditableMap
                areaNotes={areaNotes}
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
      const currentLease = getCurrentLease(state);
      return {
        areaNotes: getAreaNoteList(state),
        areasFormValues: getFormValues(FormNames.LEASE_AREAS)(state),
        attributes: getAttributes(state),
        commentAttributes: getCommentAttributes(state),
        comments: getCommentsByLease(state, currentLease.id),
        constructabilityFormValues: getFormValues(FormNames.CONSTRUCTABILITY)(state),
        contactAttributes: getContactAttributes(state),
        contractsFormValues: getFormValues(FormNames.CONTRACTS)(state),
        currentLease: currentLease,
        decisionsFormValues: getFormValues(FormNames.DECISIONS)(state),
        inspectionsFormValues: getFormValues(FormNames.INSPECTIONS)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isEditMode: getIsEditMode(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isConstructabilityFormDirty: isDirty(FormNames.CONSTRUCTABILITY)(state),
        isConstructabilityFormValid: getIsFormValidById(state, FormNames.CONSTRUCTABILITY),
        isContractsFormDirty: isDirty(FormNames.CONTRACTS)(state),
        isContractsFormValid: getIsFormValidById(state, FormNames.CONTRACTS),
        isDecisionsFormDirty: isDirty(FormNames.DECISIONS)(state),
        isDecisionsFormValid: getIsFormValidById(state, FormNames.DECISIONS),
        isInspectionsFormDirty: isDirty(FormNames.INSPECTIONS)(state),
        isInspectionsFormValid: getIsFormValidById(state, FormNames.INSPECTIONS),
        isLeaseAreasFormDirty: isDirty(FormNames.LEASE_AREAS)(state),
        isLeaseAreasFormValid: getIsFormValidById(state, FormNames.LEASE_AREAS),
        isLeaseInfoFormDirty: isDirty(FormNames.LEASE_INFO)(state),
        isLeaseInfoFormValid: getIsFormValidById(state, FormNames.LEASE_INFO),
        isRentsFormDirty: isDirty(FormNames.RENTS)(state),
        isRentsFormValid: getIsFormValidById(state, FormNames.RENTS),
        isSummaryFormDirty: isDirty(FormNames.SUMMARY)(state),
        isSummaryFormValid: getIsFormValidById(state, FormNames.SUMMARY),
        isTenantsFormDirty: isDirty(FormNames.TENANTS)(state),
        isTenantsFormValid: getIsFormValidById(state, FormNames.TENANTS),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseInfoFormValues: getFormValues(FormNames.LEASE_INFO)(state),
        rentsFormValues: getFormValues(FormNames.RENTS)(state),
        summaryFormValues: getFormValues(FormNames.SUMMARY)(state),
        tenantsFormValues: getFormValues(FormNames.TENANTS)(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      destroy,
      fetchAreaNoteList,
      fetchAttributes,
      fetchCommentAttributes,
      fetchCommentsByLease,
      fetchContactAttributes,
      fetchDecisionsByLease,
      fetchInvoiceAttributes,
      fetchInvoices,
      fetchInvoiceSetsByLease,
      fetchNoticePeriods,
      fetchSingleLease,
      hideEditMode,
      initialize,
      patchLease,
      receiveFormValidFlags,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LeasePage);
