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
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
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
  fetchSingleLease,
  hideEditMode,
  patchLease,
  receiveFormValidFlags,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/leases/actions';
import {fetchLeaseTypes} from '$src/leaseType/actions';
import {clearPreviewInvoices} from '$src/previewInvoices/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchVats} from '$src/vat/actions';
import {
  FormNames,
  LeaseAreasFieldPaths,
  LeaseBasisOfRentsFieldPaths,
  LeaseContractsFieldPaths,
  LeaseDecisionsFieldPaths,
  LeaseInspectionsFieldPaths,
  LeaseRentsFieldPaths,
  LeaseTenantsFieldPaths,
} from '$src/leases/enums';
import {FormNames as ComponentFormNames} from '$components/enums';
import {PermissionMissingTexts} from '$src/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {clearUnsavedChanges} from '$src/leases/helpers';
import * as contentHelpers from '$src/leases/helpers';
import {hasPermissions, isFieldAllowedToRead, scrollToTopPage} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getCommentsByLease} from '$src/comments/selectors';
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

import type {Attributes, Methods} from '$src/types';
import type {CommentList} from '$src/comments/types';
import type {Lease} from '$src/leases/types';
import type {LeaseTypeList} from '$src/leaseType/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import type {VatList} from '$src/vat/types';

type Props = {
  areasFormValues: Object,
  change: Function,
  clearFormValidFlags: Function,
  clearPreviewInvoices: Function,
  collectionCourtDecisionMethods: Methods, // Get via withLeasePageAttributes
  collectionLetterMethods: Methods, // Get via withLeasePageAttributes
  collectionNoteMethods: Methods, // Get via withLeasePageAttributes
  comments: CommentList,
  commentMethods: Methods, // get via withLeasePageAttributes HOC
  contractsFormValues: Object,
  constructabilityFormValues: Object,
  currentLease: Object,
  decisionsFormValues: Object,
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
  initialize: Function,
  inspectionsFormValues: Object,
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
  leaseMethods: Methods, // get via withCommonAttributes HOC
  leaseTypeList: LeaseTypeList,
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
      params: {leaseId},
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
    if(collectionCourtDecisionMethods.GET) {
      fetchCollectionCourtDecisionsByLease(leaseId);
    }
    // Fetch collection letters if GET is allowed
    if(collectionLetterMethods.GET) {
      fetchCollectionLettersByLease(leaseId);
    }
    // Fetch collection notes if GET is allowed
    if(collectionNoteMethods.GET) {
      fetchCollectionNotesByLease(leaseId);
    }

    if(isEmpty(leaseTypeList)) {
      fetchLeaseTypes();
    }

    if(isEmpty(vats)) {
      fetchVats();
    }

    fetchAreaNoteList();

    hideEditMode();
  }

  componentDidMount() {
    const {
      location,
      receiveTopNavigationSettings,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.LEASES),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentDidUpdate(prevProps:Props, prevState: State) {
    const {params: {leaseId}} = this.props;

    if(prevProps.usersPermissions !== this.props.usersPermissions) {
      if(hasPermissions(this.props.usersPermissions, UsersPermissions.VIEW_INVOICE)) {
        const {fetchInvoicesByLease} = this.props;

        fetchInvoicesByLease(leaseId);
      }

      if(hasPermissions(this.props.usersPermissions, UsersPermissions.VIEW_INVOICESET)) {
        const {fetchInvoiceSetsByLease} = this.props;

        fetchInvoiceSetsByLease(leaseId);
      }
    }
    // Fetch collection court decisions when getting new collection court decision methods and GET is allowed
    if(prevProps.collectionCourtDecisionMethods !== this.props.collectionCourtDecisionMethods && this.props.collectionCourtDecisionMethods.GET) {
      const {fetchCollectionCourtDecisionsByLease} = this.props;

      fetchCollectionCourtDecisionsByLease(leaseId);
    }
    // Fetch collection letters when getting new collection letter methods and GET is allowed
    if(prevProps.collectionLetterMethods !== this.props.collectionLetterMethods && this.props.collectionLetterMethods.GET) {
      const {fetchCollectionLettersByLease} = this.props;

      fetchCollectionLettersByLease(leaseId);
    }
    // Fetch collection notes when getting new collection note methods and GET is allowed
    if(prevProps.collectionNoteMethods !== this.props.collectionNoteMethods && this.props.collectionNoteMethods.GET) {
      const {fetchCollectionNotesByLease} = this.props;

      fetchCollectionNotesByLease(leaseId);
    }

    if (prevProps.location !== this.props.location) {
      this.setState({activeTab: this.props.location.query.tab});
    }

    if(prevState.activeTab !== this.state.activeTab) {
      scrollToTopPage();
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

  componentWillUnmount() {
    const {
      clearPreviewInvoices,
      destroy,
      hideEditMode,
      params: {leaseId},
      router: {location: {pathname}},
    } = this.props;


    if(pathname !== `${getRouteById(Routes.LEASES)}/${leaseId}`) {
      clearUnsavedChanges();
    }
    this.stopAutoSaveTimer();

    clearPreviewInvoices();
    destroy(ComponentFormNames.INVOICE_SIMULATOR);
    destroy(ComponentFormNames.RENT_CALCULATOR);
    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
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

    destroy(FormNames.CONSTRUCTABILITY);
    destroy(FormNames.CONTRACTS);
    destroy(FormNames.DECISIONS);
    destroy(FormNames.INSPECTIONS);
    destroy(FormNames.LEASE_AREAS);
    destroy(FormNames.RENTS);
    destroy(FormNames.SUMMARY);
    destroy(FormNames.TENANTS);
  }

  initializeForms = (lease: Lease) => {
    const {initialize} = this.props,
      areas = contentHelpers.getContentLeaseAreas(lease);

    initialize(FormNames.CONSTRUCTABILITY, {lease_areas: contentHelpers.getContentConstructability(lease)});
    initialize(FormNames.CONTRACTS, {contracts: contentHelpers.getContentContracts(lease)});
    initialize(FormNames.DECISIONS, {decisions: contentHelpers.getContentDecisions(lease)});
    initialize(FormNames.INSPECTIONS, {inspections: contentHelpers.getContentInspections(lease)});
    initialize(FormNames.LEASE_AREAS, {
      lease_areas_active: areas.filter((area) => !area.archived_at),
      lease_areas_archived: areas.filter((area) => area.archived_at),
    });
    initialize(FormNames.RENTS, {
      basis_of_rents: contentHelpers.getContentBasisOfRents(lease, false),
      basis_of_rents_archived: contentHelpers.getContentBasisOfRents(lease, true),
      is_rent_info_complete: lease.is_rent_info_complete,
      ...contentHelpers.getContentRentsFormData(lease),
    });
    initialize(FormNames.SUMMARY, contentHelpers.getContentSummary(lease));
    initialize(FormNames.TENANTS, {...contentHelpers.getContentTenantsFormData(lease)});
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

  cancelChanges = () => {
    const {hideEditMode} = this.props;
    hideEditMode();
  }

  saveChanges = () => {
    const {receiveIsSaveClicked} = this.props;
    receiveIsSaveClicked(true);

    const areFormsValid = this.validateForms();
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
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    // Remove page specific url parameters when moving to lease list page
    query.tab = undefined;
    query.lease_area = undefined;
    query.plan_unit = undefined;
    query.plot = undefined;

    return router.push({
      pathname: `${getRouteById(Routes.LEASES)}`,
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
      usersPermissions,
    } = this.props;

    const areFormsValid = this.validateForms();
    const isFetchingAttributes = this.getIsFetchingAttributes();

    if(isFetching || isFetchingAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!leaseMethods.GET) return <PageContainer><AuthorizationError text={PermissionMissingTexts.LEASE} /></PageContainer>;

    if(isEmpty(currentLease)) return null;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowComments={commentMethods.GET}
              allowEdit={leaseMethods.PATCH}
              commentAmount={comments ? comments.length : 0}
              isCancelDisabled={activeTab == 6}
              isEditDisabled={activeTab == 6}
              isEditMode={isEditMode}
              isSaveDisabled={activeTab == 6 || (isSaveClicked && !areFormsValid)}
              onCancel={this.cancelChanges}
              onComment={this.toggleCommentPanel}
              onEdit={this.openEditMode}
              onSave={this.saveChanges}
            />
          }
          infoComponent={<LeaseInfo />}
          onBack={this.handleBack}
        />

        <PageContainer className='with-control-bar'>
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <Authorization allow={leaseMethods.PATCH}>
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
                allow: leaseMethods.GET,
              },
            ]}
            onTabClick={this.handleTabClick}
          />

          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode
                  ? <Authorization
                    allow={leaseMethods.PATCH}
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
                    allow={leaseMethods.PATCH && isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
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
                    allow={leaseMethods.PATCH && isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}
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
                    allow={leaseMethods.PATCH &&
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
                    allow={leaseMethods.PATCH &&
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
                    allow={leaseMethods.PATCH && isFieldAllowedToRead(leaseAttributes, LeaseAreasFieldPaths.LEASE_AREAS)}
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
                <Authorization allow={leaseMethods.GET}>
                  <SingleLeaseMap />
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
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        areasFormValues: getFormValues(FormNames.LEASE_AREAS)(state),
        comments: getCommentsByLease(state, currentLease.id),
        constructabilityFormValues: getFormValues(FormNames.CONSTRUCTABILITY)(state),
        contractsFormValues: getFormValues(FormNames.CONTRACTS)(state),
        currentLease: currentLease,
        decisionsFormValues: getFormValues(FormNames.DECISIONS)(state),
        inspectionsFormValues: getFormValues(FormNames.INSPECTIONS)(state),
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
        isRentsFormDirty: isDirty(FormNames.RENTS)(state),
        isRentsFormValid: getIsFormValidById(state, FormNames.RENTS),
        isSaving: getIsSaving(state),
        isSummaryFormDirty: isDirty(FormNames.SUMMARY)(state),
        isSummaryFormValid: getIsFormValidById(state, FormNames.SUMMARY),
        isTenantsFormDirty: isDirty(FormNames.TENANTS)(state),
        isTenantsFormValid: getIsFormValidById(state, FormNames.TENANTS),
        isFetching: getIsFetching(state),
        isSaveClicked: getIsSaveClicked(state),
        leaseTypeList: getLeaseTypeList(state),
        rentsFormValues: getFormValues(FormNames.RENTS)(state),
        summaryFormValues: getFormValues(FormNames.SUMMARY)(state),
        tenantsFormValues: getFormValues(FormNames.TENANTS)(state),
        vats: getVats(state),
      };
    },
    {
      change,
      clearFormValidFlags,
      clearPreviewInvoices,
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
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(LeasePage);
