// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {change, destroy, getFormValues, initialize, isDirty} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import AuthorizationError from '$components/authorization/AuthorizationError';
import CommentPanel from './leaseSections/comments/CommentPanel';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Constructability from './leaseSections/constructability/Constructability';
import ConstructabilityEdit from './leaseSections/constructability/ConstructabilityEdit';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import DecisionsMain from './leaseSections/contract/DecisionsMain';
import DecisionsMainEdit from './leaseSections/contract/DecisionsMainEdit';
import FullWidthContainer from '$components/content/FullWidthContainer';
import Invoices from './leaseSections/invoice/Invoices';
import LeaseAreas from './leaseSections/leaseArea/LeaseAreas';
import LeaseAreasEdit from './leaseSections/leaseArea/LeaseAreasEdit';
import LeaseAuditLog from './leaseSections/auditLog/LeaseAuditLog';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import Rents from './leaseSections/rent/Rents';
import RentsEdit from './leaseSections/rent/RentsEdit';
import SingleLeaseMap from './leaseSections/map/SingleLeaseMap';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import TenantsEdit from './leaseSections/tenant/TenantsEdit';
import Tenants from './leaseSections/tenant/Tenants';
import {fetchAreaNoteList} from '$src/areaNote/actions';
import {fetchCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/actions';
import {fetchCollectionLettersByLease} from '$src/collectionLetter/actions';
import {fetchCollectionNotesByLease} from '$src/collectionNote/actions';
import {fetchInvoicesByLease} from '$src/invoices/actions';
import {fetchInvoiceSetsByLease} from '$src/invoiceSets/actions';
import {
  clearFormValidFlags,
  deleteLease,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  receiveSingleLease,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/leases/actions';
import {fetchLeaseTypes} from '$src/leaseType/actions';
import {clearPreviewInvoices} from '$src/previewInvoices/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchVats} from '$src/vat/actions';
import {FormNames, Methods, PermissionMissingTexts} from '$src/enums';
import {
  DeleteLeaseTexts,
  LeaseAreasFieldPaths,
  LeaseBasisOfRentsFieldPaths,
  LeaseContractsFieldPaths,
  LeaseDecisionsFieldPaths,
  LeaseInspectionsFieldPaths,
  LeaseRentsFieldPaths,
  LeaseTenantsFieldPaths,
} from '$src/leases/enums';
import {ButtonColors} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {clearUnsavedChanges, getContentLeaseIdentifier} from '$src/leases/helpers';
import * as contentHelpers from '$src/leases/helpers';
import {
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToRead,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getCommentsByLease} from '$src/comments/selectors';
import {getInvoicesByLease} from '$src/invoices/selectors';
import {
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getIsFormValidById,
  getIsFormValidFlags,
  getIsSaveClicked,
  getIsSaving,
} from '$src/leases/selectors';
import {getLeaseTypeList} from '$src/leaseType/selectors';
import {getVats} from '$src/vat/selectors';
import {getSessionStorageItem, removeSessionStorageItem, setSessionStorageItem} from '$util/storage';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withLeasePageAttributes} from '$components/attributes/LeasePageAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {CommentList} from '$src/comments/types';
import type {InvoiceList} from '$src/invoices/types';
import type {Lease} from '$src/leases/types';
import type {LeaseTypeList} from '$src/leaseType/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import type {VatList} from '$src/vat/types';

type Props = {
  areasFormValues: Object,
  change: Function,
  clearFormValidFlags: Function,
  clearPreviewInvoices: Function,
  collectionCourtDecisionMethods: MethodsType, // Get via withLeasePageAttributes
  collectionLetterMethods: MethodsType, // Get via withLeasePageAttributes
  collectionNoteMethods: MethodsType, // Get via withLeasePageAttributes
  comments: CommentList,
  commentMethods: MethodsType, // get via withLeasePageAttributes HOC
  contractsFormValues: Object,
  constructabilityFormValues: Object,
  currentLease: Object,
  decisionsFormValues: Object,
  deleteLease: Function,
  destroy: Function,
  fetchAreaNoteList: Function,
  fetchCollectionCourtDecisionsByLease: Function,
  fetchCollectionLettersByLease: Function,
  fetchCollectionNotesByLease: Function,
  fetchInvoicesByLease: Function,
  fetchInvoiceSetsByLease: Function,
  fetchLeaseTypes: Function,
  fetchSingleLease: Function,
  fetchVats: Function,
  hideEditMode: Function,
  history: Object,
  initialize: Function,
  inspectionsFormValues: Object,
  invoices: InvoiceList,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  isFetchingLeasePageAttributes: boolean, // get via withLeasePageAttributes HOC
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
  isRentsFormDirty: boolean,
  isRentsFormValid: boolean,
  isSaving: boolean,
  isSummaryFormDirty: boolean,
  isSummaryFormValid: boolean,
  isTenantsFormDirty: boolean,
  isTenantsFormValid: boolean,
  isSaveClicked: boolean,
  leaseAttributes: Attributes, // get via withCommonAttributes HOC
  leaseMethods: MethodsType, // get via withCommonAttributes HOC
  leaseTypeList: LeaseTypeList,
  location: Object,
  match: {
    params: Object,
  },
  patchLease: Function,
  receiveSingleLease: Function,
  receiveFormValidFlags: Function,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  rentsFormValues: Object,
  showEditMode: Function,
  summaryFormValues: Object,
  tenantsFormValues: Object,
  usersPermissions: UsersPermissionsType, // Get via withCommonAttributes HOC
  vats: VatList,
}

type State = {
  activeTab: number,
  isCommentPanelOpen: boolean,
  isRestoreModalOpen: boolean,
};

class LeasePage extends Component<Props, State> {
  state = {
    activeTab: 0,
    isCommentPanelOpen: false,
    isRestoreModalOpen: false,
  }

  timerAutoSave: any

  static contextTypes = {
    router: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    const {
      collectionCourtDecisionMethods,
      collectionLetterMethods,
      collectionNoteMethods,
      fetchAreaNoteList,
      fetchCollectionLettersByLease,
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionNotesByLease,
      fetchInvoicesByLease,
      fetchInvoiceSetsByLease,
      fetchLeaseTypes,
      fetchSingleLease,
      fetchVats,
      hideEditMode,
      leaseTypeList,
      match: {params: {leaseId}},
      usersPermissions,
      vats,
    } = this.props;

    fetchSingleLease(leaseId);

    // Fetch invoices if user has permissions
    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
      fetchInvoicesByLease(leaseId);
    }

    // Fetch invoice sets if user has permissions
    if(hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICESET)) {
      fetchInvoiceSetsByLease(leaseId);
    }
    // Fetch collection court decisions if GET is allowed
    if(isMethodAllowed(collectionCourtDecisionMethods, Methods.GET)) {
      fetchCollectionCourtDecisionsByLease(leaseId);
    }
    // Fetch collection letters if GET is allowed
    if(isMethodAllowed(collectionLetterMethods, Methods.GET)) {
      fetchCollectionLettersByLease(leaseId);
    }
    // Fetch collection notes if GET is allowed
    if(isMethodAllowed(collectionNoteMethods, Methods.GET)) {
      fetchCollectionNotesByLease(leaseId);
    }

    if(isEmpty(leaseTypeList)) {
      fetchLeaseTypes();
    }

    if(isEmpty(vats)) {
      fetchVats();
    }

    fetchAreaNoteList({});

    hideEditMode();
  }

  componentDidMount() {
    const {
      location: {search},
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    this.setPageTitle();

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    if (query.tab) {
      this.setState({activeTab: query.tab});
    }

    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {
      collectionCourtDecisionMethods,
      collectionLetterMethods,
      collectionNoteMethods,
      currentLease,
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionLettersByLease,
      fetchCollectionNotesByLease,
      fetchInvoicesByLease,
      fetchInvoiceSetsByLease,
      isEditMode,
      location,
      location: {search},
      match: {params: {leaseId}},
      usersPermissions,
    } = this.props;
    const {activeTab} = this.state;
    const query = getUrlParams(search);

    if(prevProps.usersPermissions !== usersPermissions) {
      if(hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
        fetchInvoicesByLease(leaseId);
      }

      if(hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICESET)) {
        fetchInvoiceSetsByLease(leaseId);
      }
    }
    // Fetch collection court decisions when getting new collection court decision methods and GET is allowed
    if(prevProps.collectionCourtDecisionMethods !== collectionCourtDecisionMethods && isMethodAllowed(collectionCourtDecisionMethods, Methods.GET)) {
      fetchCollectionCourtDecisionsByLease(leaseId);
    }
    // Fetch collection letters when getting new collection letter methods and GET is allowed
    if(prevProps.collectionLetterMethods !== collectionLetterMethods && isMethodAllowed(collectionLetterMethods, Methods.GET)) {
      fetchCollectionLettersByLease(leaseId);
    }
    // Fetch collection notes when getting new collection note methods and GET is allowed
    if(prevProps.collectionNoteMethods !== collectionNoteMethods && isMethodAllowed(collectionNoteMethods, Methods.GET)) {
      fetchCollectionNotesByLease(leaseId);
    }

    if (prevProps.location !== location) {
      this.setState({activeTab: query.tab});
    }

    if(prevState.activeTab !== activeTab) {
      scrollToTopPage();
    }

    if(isEmpty(prevProps.currentLease) && !isEmpty(currentLease)) {
      const storedLeaseId = getSessionStorageItem('leaseId');

      if(Number(leaseId) === storedLeaseId) {
        this.setState({isRestoreModalOpen: true});
      }
    }

    // Stop autosave timer and clear form data from session storage after saving/cancelling changes
    if(prevProps.isEditMode && !isEditMode) {
      this.stopAutoSaveTimer();
      clearUnsavedChanges();
    }

    if(prevProps.currentLease !== currentLease) {
      this.setPageTitle();
    }
  }

  componentWillUnmount() {
    const {
      clearPreviewInvoices,
      destroy,
      hideEditMode,
      location: {pathname},
      match: {params: {leaseId}},
      receiveSingleLease,
    } = this.props;


    if(pathname !== `${getRouteById(Routes.LEASES)}/${leaseId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    clearPreviewInvoices();
    // Clear current lease
    receiveSingleLease({});

    destroy(FormNames.INVOICE_SIMULATOR);
    destroy(FormNames.RENT_CALCULATOR);
    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  setPageTitle = () => {
    const {currentLease} = this.props;
    const identifier = getContentLeaseIdentifier(currentLease);

    setPageTitle(`${identifier
      ? `${identifier} | `
      : ''}Vuokraus`);
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

    destroy(FormNames.LEASE_CONSTRUCTABILITY);
    destroy(FormNames.LEASE_CONTRACTS);
    destroy(FormNames.LEASE_DECISIONS);
    destroy(FormNames.LEASE_INSPECTIONS);
    destroy(FormNames.LEASE_AREAS);
    destroy(FormNames.LEASE_RENTS);
    destroy(FormNames.LEASE_SUMMARY);
    destroy(FormNames.LEASE_TENANTS);
  }

  initializeForms = (lease: Lease) => {
    const {initialize} = this.props,
      areas = contentHelpers.getContentLeaseAreas(lease);

    initialize(FormNames.LEASE_CONSTRUCTABILITY, {lease_areas: contentHelpers.getContentConstructability(lease)});
    initialize(FormNames.LEASE_CONTRACTS, {contracts: contentHelpers.getContentContracts(lease)});
    initialize(FormNames.LEASE_DECISIONS, {decisions: contentHelpers.getContentDecisions(lease)});
    initialize(FormNames.LEASE_INSPECTIONS, {inspections: contentHelpers.getContentInspections(lease)});
    initialize(FormNames.LEASE_AREAS, {
      lease_areas_active: areas.filter((area) => !area.archived_at),
      lease_areas_archived: areas.filter((area) => area.archived_at),
    });
    initialize(FormNames.LEASE_RENTS, {
      basis_of_rents: contentHelpers.getContentBasisOfRents(lease, false),
      basis_of_rents_archived: contentHelpers.getContentBasisOfRents(lease, true),
      is_rent_info_complete: lease.is_rent_info_complete,
      ...contentHelpers.getContentRentsFormData(lease),
    });
    initialize(FormNames.LEASE_SUMMARY, contentHelpers.getContentSummary(lease));
    initialize(FormNames.LEASE_TENANTS, {...contentHelpers.getContentTenantsFormData(lease)});
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

    const storedConstructabilityFormValues = getSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY);
    if(storedConstructabilityFormValues) {
      this.bulkChange(FormNames.LEASE_CONSTRUCTABILITY, storedConstructabilityFormValues);
    }

    const storedContractsFormValues = getSessionStorageItem(FormNames.LEASE_CONTRACTS);
    if(storedContractsFormValues) {
      this.bulkChange(FormNames.LEASE_CONTRACTS, storedContractsFormValues);
    }

    const storedDecisionsFormValues = getSessionStorageItem(FormNames.LEASE_DECISIONS);
    if(storedDecisionsFormValues) {
      this.bulkChange(FormNames.LEASE_DECISIONS, storedDecisionsFormValues);
    }

    const storedInspectionsFormValues = getSessionStorageItem(FormNames.LEASE_INSPECTIONS);
    if(storedInspectionsFormValues) {
      this.bulkChange(FormNames.LEASE_INSPECTIONS, storedInspectionsFormValues);
    }

    const storedRentsFormValues = getSessionStorageItem(FormNames.LEASE_RENTS);
    if(storedRentsFormValues) {
      this.bulkChange(FormNames.LEASE_RENTS, storedRentsFormValues);
    }

    const storedSummaryFormValues = getSessionStorageItem(FormNames.LEASE_SUMMARY);
    if(storedSummaryFormValues) {
      this.bulkChange(FormNames.LEASE_SUMMARY, storedSummaryFormValues);
    }

    const storedTenantsFormValues = getSessionStorageItem(FormNames.LEASE_TENANTS);
    if(storedTenantsFormValues) {
      this.bulkChange(FormNames.LEASE_TENANTS, storedTenantsFormValues);
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
      isRentsFormDirty,
      isSummaryFormDirty,
      isTenantsFormDirty,
      isFormValidFlags,
      match: {params: {leaseId}},
      rentsFormValues,
      summaryFormValues,
      tenantsFormValues,

    } = this.props;
    let isDirty = false;

    if(isConstructabilityFormDirty) {
      setSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY, constructabilityFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONSTRUCTABILITY);
    }

    if(isContractsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_CONTRACTS, contractsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_CONTRACTS);
    }

    if(isDecisionsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_DECISIONS, decisionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_DECISIONS);
    }

    if(isInspectionsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_INSPECTIONS, inspectionsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_INSPECTIONS);
    }

    if(isLeaseAreasFormDirty) {
      setSessionStorageItem(FormNames.LEASE_AREAS, areasFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_AREAS);
    }

    if(isRentsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_RENTS, rentsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_RENTS);
    }

    if(isSummaryFormDirty) {
      setSessionStorageItem(FormNames.LEASE_SUMMARY, summaryFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_SUMMARY);
    }

    if(isTenantsFormDirty) {
      setSessionStorageItem(FormNames.LEASE_TENANTS, tenantsFormValues);
      isDirty = true;
    } else {
      removeSessionStorageItem(FormNames.LEASE_TENANTS);
    }

    if(isDirty) {
      setSessionStorageItem('leaseId', leaseId);
      setSessionStorageItem('leaseValidity', isFormValidFlags);
    } else {
      removeSessionStorageItem('leaseId');
      removeSessionStorageItem('leaseValidity');
    }
  };

  cancelChanges = () => {
    const {hideEditMode} = this.props;

    hideEditMode();
  }

  saveChanges = () => {
    const {receiveIsSaveClicked} = this.props;
    const areFormsValid = this.validateForms();
    receiveIsSaveClicked(true);

    if(areFormsValid) {
      const {
        areasFormValues,
        constructabilityFormValues,
        contractsFormValues,
        currentLease,
        decisionsFormValues,
        inspectionsFormValues,
        patchLease,
        rentsFormValues,
        summaryFormValues,
        tenantsFormValues,
        isConstructabilityFormDirty,
        isContractsFormDirty,
        isDecisionsFormDirty,
        isInspectionsFormDirty,
        isLeaseAreasFormDirty,
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
      if(isRentsFormDirty) {
        payload = contentHelpers.addRentsFormValues(payload, rentsFormValues, currentLease);
      }
      if(isSummaryFormDirty) {
        payload = contentHelpers.addSummaryFormValues(payload, summaryFormValues);
      }
      if(isTenantsFormDirty) {
        payload = contentHelpers.addTenantsFormValues(payload, tenantsFormValues);
      }

      patchLease(payload);
    }
  }

  validateForms = () => {
    const {
      isConstructabilityFormValid,
      isContractsFormValid,
      isDecisionsFormValid,
      isInspectionsFormValid,
      isLeaseAreasFormValid,
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
      isRentsFormValid &&
      isSummaryFormValid &&
      isTenantsFormValid
    );
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
      pathname: `${getRouteById(Routes.LEASES)}`,
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
      isRentsFormDirty ||
      isSummaryFormDirty ||
      isTenantsFormDirty
    );
  }

  getIsFetchingAttributes = () => {
    const {isFetchingLeasePageAttributes, isFetchingCommonAttributes} = this.props;

    return isFetchingLeasePageAttributes || isFetchingCommonAttributes;
  }

  shouldShowDelete = () => {
    const {comments, currentLease, invoices} = this.props;

    if(!comments || isEmpty(currentLease) || !invoices) return false;

    const {
      basis_of_rents,
      collection_court_decisions,
      collection_letters,
      collection_notes,
      contracts,
      decisions,
      infill_development_compensations,
      inspections,
      lease_areas,
      related_leases: {related_to, related_from},
      rents,
      tenants,
    } = currentLease;
    if(basis_of_rents.length ||
      collection_court_decisions.length ||
      collection_letters.length ||
      collection_notes.length ||
      comments.length ||
      contracts.length ||
      decisions.length ||
      infill_development_compensations.length ||
      inspections.length ||
      invoices.length ||
      lease_areas.length ||
      related_to.length ||
      related_from.length ||
      rents.length ||
      tenants.length) {
      return false;
    }

    return true;
  }

  handleDelete = () => {
    const {
      deleteLease,
      match: {params},
    } = this.props;

    deleteLease(params.leaseId);
  }

  render() {
    const {
      activeTab,
      isCommentPanelOpen,
      isRestoreModalOpen,
    } = this.state;
    const {
      commentMethods,
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
      isSaving,
      leaseAttributes,
      leaseMethods,
      match: {params: {leaseId}},
      usersPermissions,
    } = this.props;
    const showDelete = this.shouldShowDelete();
    const areFormsValid = this.validateForms();
    const isFetchingAttributes = this.getIsFetchingAttributes();

    if(isFetching || isFetchingAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!leaseMethods) return null;

    if(!isMethodAllowed(leaseMethods, Methods.GET)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LEASE} /></PageContainer>;

    if(isEmpty(currentLease)) return null;

    return (
      <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar
            buttonComponent={
              <ControlButtons
                allowComments={isMethodAllowed(commentMethods, Methods.GET)}
                allowDelete={isMethodAllowed(leaseMethods, Methods.DELETE)}
                allowEdit={isMethodAllowed(leaseMethods, Methods.PATCH)}
                commentAmount={comments ? comments.length : 0}
                deleteModalTexts={{
                  buttonClassName: ButtonColors.ALERT,
                  buttonText: DeleteLeaseTexts.BUTTON,
                  label: DeleteLeaseTexts.LABEL,
                  title: DeleteLeaseTexts.TITLE,
                }}
                isCancelDisabled={activeTab == 6}
                isEditDisabled={activeTab == 6}
                isEditMode={isEditMode}
                isSaveDisabled={activeTab == 6 || (isSaveClicked && !areFormsValid)}
                onCancel={this.cancelChanges}
                onComment={this.toggleCommentPanel}
                onDelete={showDelete ? this.handleDelete : null}
                onEdit={this.openEditMode}
                onSave={this.saveChanges}
              />
            }
            infoComponent={<LeaseInfo />}
            onBack={this.handleBack}
          />

          <Tabs
            active={activeTab}
            isEditMode={isEditMode}
            tabs={[
              {
                label: 'Yhteenveto',
                allow: true,
                isDirty: isSummaryFormDirty,
                hasError: isSaveClicked && !isSummaryFormValid,
              },
              {
                label: 'Vuokra-alue',
                allow: isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS),
                isDirty: isLeaseAreasFormDirty,
                hasError: isSaveClicked && !isLeaseAreasFormValid,
              },
              {
                label: 'Vuokralaiset',
                allow: isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS),
                isDirty: isTenantsFormDirty,
                hasError: isSaveClicked && !isTenantsFormValid,
              },
              {
                label: 'Vuokrat',
                allow: isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS ||
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)),
                isDirty: isRentsFormDirty,
                hasError: isSaveClicked && !isRentsFormValid,
              },
              {
                label: 'Päätökset ja sopimukset',
                allow: isFieldAllowedToRead(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS) ||
                  isFieldAllowedToRead(leaseAttributes, LeaseContractsFieldPaths.CONTRACTS) ||
                  isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTIONS),
                isDirty: (isContractsFormDirty || isDecisionsFormDirty || isInspectionsFormDirty),
                hasError: isSaveClicked && (!isContractsFormValid || !isDecisionsFormValid || !isInspectionsFormValid),
              },
              {
                label: 'Rakentamiskelpoisuus',
                allow: isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS),
                isDirty: isConstructabilityFormDirty,
                hasError: isSaveClicked && !isConstructabilityFormValid,
              },
              {
                label: 'Laskutus',
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE),
              },
              {
                label: 'Kartta',
                allow: isMethodAllowed(leaseMethods, Methods.GET),
              },
              {
                label: 'Muutoshistoria',
                allow: isMethodAllowed(leaseMethods, Methods.GET),
              },
            ]}
            onTabClick={this.handleTabClick}
          />
        </PageNavigationWrapper>

        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <Authorization allow={isMethodAllowed(leaseMethods, Methods.PATCH)}>
            <ConfirmationModal
              confirmButtonLabel='Palauta muutokset'
              isOpen={isRestoreModalOpen}
              label='Lomakkeella on tallentamattomia muutoksia. Haluatko palauttaa muutokset?'
              onCancel={this.cancelRestoreUnsavedChanges}
              onClose={this.cancelRestoreUnsavedChanges}
              onSave={this.restoreUnsavedChanges}
              title='Palauta tallentamattomat muutokset'
            />
          </Authorization>

          <CommentPanel
            isOpen={isCommentPanelOpen}
            onClose={this.toggleCommentPanel}
          />

          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><SummaryEdit /></Authorization>
                  : <Summary />
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH) && isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><LeaseAreasEdit /></Authorization>
                  : <Authorization
                    allow={isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><LeaseAreas /></Authorization>
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH) && isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><TenantsEdit /></Authorization>
                  : <Authorization
                    allow={isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><Tenants /></Authorization>
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH) &&
                      (isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS))}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><RentsEdit /></Authorization>
                  : <Authorization
                    allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><Rents /></Authorization>
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseContractsFieldPaths.CONTRACTS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTIONS)
                    }
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><DecisionsMainEdit /></Authorization>
                  : <Authorization
                    allow={isFieldAllowedToRead(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseContractsFieldPaths.CONTRACTS) ||
                      isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTIONS)
                    }
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><DecisionsMain /></Authorization>
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={isMethodAllowed(leaseMethods, Methods.PATCH) && isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><ConstructabilityEdit /></Authorization>
                  : <Authorization
                    allow={isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
                    errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                  ><Constructability /></Authorization>
                }
              </ContentContainer>
            </TabPane>

            <TabPane className="lease-page__tab-content">
              <ContentContainer>
                <Authorization
                  allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}
                  errorComponent={<AuthorizationError text={PermissionMissingTexts.GENERAL} />}
                >
                  <Invoices />
                </Authorization>
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                  <SingleLeaseMap />
                </Authorization>
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                  <LeaseAuditLog leaseId={leaseId}/>
                </Authorization>
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withLeasePageAttributes,
  withUiDataList,
  withRouter,
  connect(
    (state, props: Props) => {
      const currentLease = getCurrentLease(state);
      return {
        areasFormValues: getFormValues(FormNames.LEASE_AREAS)(state),
        comments: getCommentsByLease(state, currentLease.id),
        constructabilityFormValues: getFormValues(FormNames.LEASE_CONSTRUCTABILITY)(state),
        contractsFormValues: getFormValues(FormNames.LEASE_CONTRACTS)(state),
        currentLease: currentLease,
        decisionsFormValues: getFormValues(FormNames.LEASE_DECISIONS)(state),
        inspectionsFormValues: getFormValues(FormNames.LEASE_INSPECTIONS)(state),
        invoices: getInvoicesByLease(state, props.match.params.leaseId),
        isEditMode: getIsEditMode(state),
        isFormValidFlags: getIsFormValidFlags(state),
        isConstructabilityFormDirty: isDirty(FormNames.LEASE_CONSTRUCTABILITY)(state),
        isConstructabilityFormValid: getIsFormValidById(state, FormNames.LEASE_CONSTRUCTABILITY),
        isContractsFormDirty: isDirty(FormNames.LEASE_CONTRACTS)(state),
        isContractsFormValid: getIsFormValidById(state, FormNames.LEASE_CONTRACTS),
        isDecisionsFormDirty: isDirty(FormNames.LEASE_DECISIONS)(state),
        isDecisionsFormValid: getIsFormValidById(state, FormNames.LEASE_DECISIONS),
        isInspectionsFormDirty: isDirty(FormNames.LEASE_INSPECTIONS)(state),
        isInspectionsFormValid: getIsFormValidById(state, FormNames.LEASE_INSPECTIONS),
        isLeaseAreasFormDirty: isDirty(FormNames.LEASE_AREAS)(state),
        isLeaseAreasFormValid: getIsFormValidById(state, FormNames.LEASE_AREAS),
        isRentsFormDirty: isDirty(FormNames.LEASE_RENTS)(state),
        isRentsFormValid: getIsFormValidById(state, FormNames.LEASE_RENTS),
        isSaving: getIsSaving(state),
        isSummaryFormDirty: isDirty(FormNames.LEASE_SUMMARY)(state),
        isSummaryFormValid: getIsFormValidById(state, FormNames.LEASE_SUMMARY),
        isTenantsFormDirty: isDirty(FormNames.LEASE_TENANTS)(state),
        isTenantsFormValid: getIsFormValidById(state, FormNames.LEASE_TENANTS),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseTypeList: getLeaseTypeList(state),
        rentsFormValues: getFormValues(FormNames.LEASE_RENTS)(state),
        summaryFormValues: getFormValues(FormNames.LEASE_SUMMARY)(state),
        tenantsFormValues: getFormValues(FormNames.LEASE_TENANTS)(state),
        vats: getVats(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      clearPreviewInvoices,
      deleteLease,
      destroy,
      fetchAreaNoteList,
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionLettersByLease,
      fetchCollectionNotesByLease,
      fetchInvoicesByLease,
      fetchInvoiceSetsByLease,
      fetchLeaseTypes,
      fetchSingleLease,
      fetchVats,
      hideEditMode,
      initialize,
      patchLease,
      receiveFormValidFlags,
      receiveIsSaveClicked,
      receiveSingleLease,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LeasePage);
