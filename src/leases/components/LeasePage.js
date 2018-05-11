// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, destroy, getFormValues, initialize, isDirty} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchCommentAttributes, fetchCommentsByLease} from '$src/comments/actions';
import {fetchAttributes as fetchContactAttributes, fetchCompleteContactList} from '$src/contacts/actions';
import {fetchDecisionsByLease} from '$src/decision/actions';
import {fetchAttributes as fetchInvoiceAttributes, fetchInvoices} from '$src/invoices/actions';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  showEditMode,
} from '$src/leases/actions';
import {fetchNoticePeriods} from '$src/noticePeriod/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchUsers} from '$src/users/actions';
import {FormNames} from '$src/leases/enums';
import {clearUnsavedChanges} from '$src/leases/helpers';
import * as contentHelpers from '$src/leases/helpers';
import {getSearchQuery} from '$util/helpers';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {getAttributes as getCommentAttributes, getCommentsByLease} from '$src/comments/selectors';
import {getAttributes as getContactAttributes} from '$src/contacts/selectors';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {
  getAttributes,
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getIsConstructabilityFormValid,
  getIsContractsFormValid,
  getIsDecisionsFormValid,
  getIsInspectionsFormValid,
  getIsLeaseAreasFormValid,
  getIsLeaseInfoFormValid,
  getIsRentsFormValid,
  getIsSummaryFormValid,
  getIsTenantsFormValid,
} from '$src/leases/selectors';
import {getRouteById} from '$src/root/routes';
import CommentPanel from '$components/commentPanel/CommentPanel';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Constructability from './leaseSections/constructability/Constructability';
import ConstructabilityEdit from './leaseSections/constructability/ConstructabilityEdit';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import DecisionsMain from './leaseSections/contract/DecisionsMain';
import DecisionsMainEdit from './leaseSections/contract/DecisionsMainEdit';
import EditableMap from '$components/map/EditableMap';
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

import type {Attributes as CommentAttributes, CommentList} from '$src/comments/types';
import type {Attributes as ContactAttributes} from '$src/contacts/types';
import type {Attributes as InvoiceAttributes} from '$src/invoices/types';
import type {Attributes, Lease} from '$src/leases/types';

import mockData from '../mock-data.json';

type Props = {
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
  fetchAttributes: Function,
  fetchCommentAttributes: Function,
  fetchCommentsByLease: Function,
  fetchCompleteContactList: Function,
  fetchContactAttributes: Function,
  fetchDecisionsByLease: Function,
  fetchInvoiceAttributes: Function,
  fetchInvoices: Function,
  fetchNoticePeriods: Function,
  fetchSingleLease: Function,
  fetchUsers: Function,
  hideEditMode: Function,
  initialize: Function,
  inspectionsFormValues: Object,
  invoiceAttributes: InvoiceAttributes,
  isEditMode: boolean,
  isFetching: boolean,
  isAreasFormDirty: boolean,
  isConstructabilityFormDirty: boolean,
  isContractsFormDirty: boolean,
  isDecisionsFormDirty: boolean,
  isInspectionsFormDirty: boolean,
  isLeaseInfoFormDirty: boolean,
  isRentsFormDirty: boolean,
  isSummaryFormDirty: boolean,
  isTenantsFormDirty: boolean,
  isConstructabilityFormValid: boolean,
  isContractsFormValid: boolean,
  isDecisionsFormValid: boolean,
  isInspectionsFormValid: boolean,
  isLeaseAreasFormValid: boolean,
  isLeaseInfoFormValid: boolean,
  isRentsFormValid: boolean,
  isSummaryFormValid: boolean,
  isTenantsFormValid: boolean,
  leaseInfoFormValues: Object,
  location: Object,
  params: Object,
  patchLease: Function,
  receiveTopNavigationSettings: Function,
  rentsFormValues: Object,
  router: Object,
  showEditMode: Function,
  summaryFormValues: Object,
  tenantsFormValues: Object,
}

type State = {
  activeTab: number,
  history: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
};

class LeasePage extends Component<Props, State> {
  state = {
    activeTab: 0,
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isSaveLeaseModalOpen: false,
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
      fetchAttributes,
      fetchCommentAttributes,
      fetchCommentsByLease,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchDecisionsByLease,
      fetchInvoiceAttributes,
      fetchInvoices,
      fetchNoticePeriods,
      fetchSingleLease,
      fetchUsers,
      invoiceAttributes,
      location,
      params: {leaseId},
      receiveTopNavigationSettings,
    } = this.props;

    const lease = mockData.leases[0];
    this.setState({
      history: contentHelpers.getContentHistory(lease),
    });

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
    fetchCompleteContactList();
    fetchDecisionsByLease(leaseId);
    fetchInvoices(getSearchQuery({lease: leaseId}));
    fetchNoticePeriods();
    fetchUsers();
  }

  componentWillReceiveProps(nextProps: Object) {
    const {fetchDecisionsByLease, params: {leaseId}} = this.props;

    if(this.props.currentLease !== nextProps.currentLease) {
      fetchDecisionsByLease(leaseId);
    }
  }

  componentDidUpdate(prevProps) {
    const {params: {leaseId}} = this.props;
    if(isEmpty(prevProps.currentLease) && !isEmpty(this.props.currentLease)) {
      const storedLeaseId = getSessionStorageItem('leaseId');
      if(Number(leaseId) === Number(storedLeaseId)) {
        this.restoreUnsavedChanges();
      }
    }
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    hideEditMode();
    this.stopAutoSaveTimer();
    clearUnsavedChanges();
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
    const {clearFormValidFlags, currentLease, showEditMode} = this.props;

    this.destroyAllForms();
    this.initializeForms(currentLease);
    clearFormValidFlags();
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
      rents: contentHelpers.getContentRents(lease),
    });
    initialize(FormNames.SUMMARY, contentHelpers.getContentSummary(lease));
    initialize(FormNames.TENANTS, {tenants: contentHelpers.getContentTenants(lease)});
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

    this.startAutoSaveTimer();

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
    this.stopAutoSaveTimer();
    clearUnsavedChanges();
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
      isAreasFormDirty,
      areasFormValues,
      isConstructabilityFormDirty,
      constructabilityFormValues,
      isContractsFormDirty,
      contractsFormValues,
      isDecisionsFormDirty,
      decisionsFormValues,
      isInspectionsFormDirty,
      inspectionsFormValues,
      isLeaseInfoFormDirty,
      leaseInfoFormValues,
      isRentsFormDirty,
      rentsFormValues,
      isSummaryFormDirty,
      summaryFormValues,
      isTenantsFormDirty,
      tenantsFormValues,
      params: {leaseId},
    } = this.props;
    let isDirty = false;

    if(isAreasFormDirty) {
      setSessionStorageItem(FormNames.LEASE_AREAS, areasFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREAS);
    }

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
    } else {
      removeSessionStorageItem('leaseId');
    }
  };

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
      isAreasFormDirty,
      isConstructabilityFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInspectionsFormDirty,
      isLeaseInfoFormDirty,
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
    } = this.props;

    let payload: Object = {id: currentLease.id};

    if(isAreasFormDirty) {
      payload = contentHelpers.addAreasFormValues(payload, areasFormValues);
    }
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
    this.hideModal('SaveLease');
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

  toggleCommentPanel = () => {
    const {isCommentPanelOpen} = this.state;
    this.setState({isCommentPanelOpen: !isCommentPanelOpen});
  }

  isAnyFormDirty = () => {
    const {
      isAreasFormDirty,
      isConstructabilityFormDirty,
      isContractsFormDirty,
      isDecisionsFormDirty,
      isInspectionsFormDirty,
      isLeaseInfoFormDirty,
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
    } = this.props;

    return (
      isAreasFormDirty ||
      isConstructabilityFormDirty ||
      isContractsFormDirty ||
      isDecisionsFormDirty ||
      isInspectionsFormDirty ||
      isLeaseInfoFormDirty ||
      isRentsFormDirty ||
      isSummaryFormDirty ||
      isTenantsFormDirty
    );

  }

  render() {
    const {
      activeTab,
      history,
      isCancelLeaseModalOpen,
      isCommentPanelOpen,
      isSaveLeaseModalOpen,
    } = this.state;

    const {
      comments,
      currentLease,
      isEditMode,
      isFetching,
    } = this.props;

    const areFormsValid = this.validateForms();
    const isDirty = this.isAnyFormDirty();

    if(isFetching) {
      return (
        <div className='lease-page'><Loader isLoading={true} /></div>
      );
    }

    if(isEmpty(currentLease)) {
      return null;
    }

    return (
      <PageContainer className='lease-page'>
        <ConfirmationModal
          isOpen={isSaveLeaseModalOpen}
          label='Haluatko varmasti tallentaa muutokset?'
          onCancel={() => this.hideModal('SaveLease')}
          onClose={() => this.hideModal('SaveLease')}
          onSave={this.save}
          title='Tallenna'
        />
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={() => this.hideModal('CancelLease')}
          onClose={() => this.hideModal('CancelLease')}
          onSave={this.cancel}
          title='Hylkää muutokset'
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
              isSaveDisabled={!areFormsValid || activeTab.toString() === '6'}
              onCancelClick={isDirty ? () => this.showModal('CancelLease') : this.cancel}
              onCommentClick={this.toggleCommentPanel}
              onEditClick={this.openEditMode}
              onSaveClick={() => this.showModal('SaveLease')}
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
          className="hero__navigation"
          tabs={[
            'Yhteenveto',
            'Vuokra-alue',
            'Vuokralaiset',
            'Vuokrat',
            'Päätökset ja sopimukset',
            'Rakentamiskelpoisuus',
            'Laskutus',
            'Kartta',
          ]}
          onTabClick={(id) => this.handleTabClick(id)}
        />

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              {isEditMode
                ? <SummaryEdit history={history} />
                : <Summary history={history} />
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
              <EditableMap/>
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
        isAreasFormDirty: isDirty(FormNames.LEASE_AREAS)(state),
        isConstructabilityFormDirty: isDirty(FormNames.CONSTRUCTABILITY)(state),
        isContractsFormDirty: isDirty(FormNames.CONTRACTS)(state),
        isDecisionsFormDirty: isDirty(FormNames.DECISIONS)(state),
        isInspectionsFormDirty: isDirty(FormNames.INSPECTIONS)(state),
        isLeaseInfoFormDirty: isDirty(FormNames.LEASE_INFO)(state),
        isRentsFormDirty: isDirty(FormNames.RENTS)(state),
        isSummaryFormDirty: isDirty(FormNames.SUMMARY)(state),
        isTenantsFormDirty: isDirty(FormNames.TENANTS)(state),
        isConstructabilityFormValid: getIsConstructabilityFormValid(state),
        isContractsFormValid: getIsContractsFormValid(state),
        isDecisionsFormValid: getIsDecisionsFormValid(state),
        isInspectionsFormValid: getIsInspectionsFormValid(state),
        isLeaseAreasFormValid: getIsLeaseAreasFormValid(state),
        isLeaseInfoFormValid: getIsLeaseInfoFormValid(state),
        isRentsFormValid: getIsRentsFormValid(state),
        isSummaryFormValid: getIsSummaryFormValid(state),
        isTenantsFormValid: getIsTenantsFormValid(state),
        isFetching: getIsFetching(state),
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
      fetchAttributes,
      fetchCommentAttributes,
      fetchCommentsByLease,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchDecisionsByLease,
      fetchInvoiceAttributes,
      fetchInvoices,
      fetchNoticePeriods,
      fetchSingleLease,
      fetchUsers,
      hideEditMode,
      initialize,
      patchLease,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LeasePage);
