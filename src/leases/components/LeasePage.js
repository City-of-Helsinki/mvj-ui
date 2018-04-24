// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy, getFormValues, initialize} from 'redux-form';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchCommentAttributes, fetchComments} from '$src/comments/actions';
import {
  fetchAttributes as fetchContactAttributes,
  fetchCompleteContactList,
} from '$src/contacts/actions';
import {fetchAttributes as fetchInvoiceAttributes, fetchInvoices} from '$src/invoices/actions';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  showEditMode,
} from '../actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {fetchUsers} from '$src/users/actions';
import {FormNames} from '../enums';
import * as contentHelpers from '../helpers';
import {getSearchQuery} from '$util/helpers';
import {getLoggedInUser} from '$src/auth/selectors';
import {getComments} from '$src/comments/selectors';
import {
  getAreasFormTouched,
  getAreasFormValues,
  getAttributes,
  getContractsFormTouched,
  getConstructabilityFormTouched,
  getCurrentLease,
  getDecisionsFormTouched,
  getInspectionsFormTouched,
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
  getLeaseInfoFormTouched,
  getRentsFormTouched,
  getSummaryFormTouched,
  getTenantsFormTouched,
} from '../selectors';
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
import Divider from '$components/content/Divider';
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
import RightSubtitle from '$components/content/RightSubtitle';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import TenantsEdit from './leaseSections/tenant/TenantsEdit';
import Tenants from './leaseSections/tenant/Tenants';

import type {CommentList} from '$src/comments/types';
import type {Attributes, Lease} from '../types';

import mockData from '../mock-data.json';

type Props = {
  areasFormTouched: boolean,
  areasFormValues: Object,
  attributes: Attributes,
  clearFormValidFlags: Function,
  comments: CommentList,
  contractsFormTouched: boolean,
  contractsFormValues: Object,
  constructabilityFormTouched: boolean,
  constructabilityFormValues: Object,
  currentLease: Object,
  decisionsFormTouched: boolean,
  decisionsFormValues: Object,
  destroy: Function,
  fetchAttributes: Function,
  fetchCommentAttributes: Function,
  fetchComments: Function,
  fetchCompleteContactList: Function,
  fetchContactAttributes: Function,
  fetchInvoiceAttributes: Function,
  fetchInvoices: Function,
  fetchSingleLease: Function,
  fetchUsers: Function,
  hideEditMode: Function,
  initialize: Function,
  inspectionsFormValues: Object,
  inspectionsFormTouched: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  isConstructabilityFormValid: boolean,
  isContractsFormValid: boolean,
  isDecisionsFormValid: boolean,
  isInspectionsFormValid: boolean,
  isLeaseAreasFormValid: boolean,
  isLeaseInfoFormValid: boolean,
  isRentsFormValid: boolean,
  isSummaryFormValid: boolean,
  isTenantsFormValid: boolean,
  leaseInfoFormTouched: boolean,
  leaseInfoFormValues: Object,
  location: Object,
  params: Object,
  patchLease: Function,
  receiveTopNavigationSettings: Function,
  rentsFormTouched: boolean,
  rentsFormValues: Object,
  showEditMode: Function,
  summaryFormTouched: boolean,
  summaryFormValues: Object,
  tenantsFormTouched: boolean,
  tenantsFormValues: Object,
  user: Object,
}

type State = {
  activeTab: number,
  history: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
};

class LeasePage extends Component {
  props: Props

  state: State = {
    activeTab: 0,
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isSaveLeaseModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      fetchAttributes,
      fetchCommentAttributes,
      fetchComments,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchInvoiceAttributes,
      fetchInvoices,
      fetchSingleLease,
      fetchUsers,
      hideEditMode,
      location,
      params: {leaseId},
      receiveTopNavigationSettings,
    } = this.props;

    const lease = mockData.leases[0];

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    hideEditMode();

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      history: contentHelpers.getContentHistory(lease),
    });

    fetchAttributes();
    fetchSingleLease(leaseId);

    fetchCommentAttributes();
    fetchComments(getSearchQuery({lease: leaseId}));

    fetchContactAttributes();
    fetchCompleteContactList();

    fetchUsers();

    fetchInvoiceAttributes();
    fetchInvoices(getSearchQuery({lease: leaseId}));
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
  }

  destroyAllForms = () => {
    const {destroy} = this.props;

    destroy('lease-areas-form');

    destroy(FormNames.CONSTRUCTABILITY);
    destroy(FormNames.CONTRACTS);
    destroy(FormNames.DECISIONS);
    destroy(FormNames.INSPECTION);
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
    initialize(FormNames.INSPECTION, {inspections: contentHelpers.getContentInspections(lease)});
    initialize(FormNames.LEASE_INFO, contentHelpers.getContentLeaseInfo(lease));
    initialize(FormNames.RENTS, {
      basis_of_rents: contentHelpers.getContentBasisOfRents(lease),
      is_rent_info_complete: lease.is_rent_info_complete,
      rents: contentHelpers.getContentRents(lease),
    });
    initialize(FormNames.SUMMARY, contentHelpers.getContentSummary(lease));
    initialize(FormNames.TENANTS, {tenants: contentHelpers.getContentTenants(lease)});
  }

  cancel = () => {
    const {hideEditMode} = this.props;

    this.hideModal('CancelLease');
    hideEditMode();
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
    } = this.props;

    let payload: Object = {id: currentLease.id};

    if(leaseInfoFormValues !== undefined) {
      payload = contentHelpers.addLeaseInfoFormValues(payload, leaseInfoFormValues);
    }

    if(summaryFormValues !== undefined) {
      payload = contentHelpers.addSummaryFormValues(payload, summaryFormValues);
    }

    if(areasFormValues !== undefined) {
      payload = contentHelpers.addAreasFormValues(payload, areasFormValues);
    }

    if(decisionsFormValues !== undefined) {
      payload = contentHelpers.addDecisionsFormValues(payload, decisionsFormValues);
    }

    if(contractsFormValues !== undefined) {
      payload = contentHelpers.addContractsFormValues(payload, contractsFormValues);
    }

    if(inspectionsFormValues !== undefined) {
      payload = contentHelpers.addInspectionsFormValues(payload, inspectionsFormValues);
    }

    if(constructabilityFormValues !== undefined) {
      payload = contentHelpers.addConstructabilityFormValues(payload, constructabilityFormValues);
    }

    if(tenantsFormValues !== undefined) {
      payload = contentHelpers.addTenantsFormValues(payload, tenantsFormValues);
    }

    if(rentsFormValues !== undefined) {
      payload = contentHelpers.addRentsFormValues(payload, rentsFormValues);
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

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;

    this.setState({activeTab: tabId}, () => {
      return router.push({
        ...location,
        query: {tab: tabId},
      });
    });
  };

  toggleCommentPanel = () => {
    const {isCommentPanelOpen} = this.state;
    this.setState({isCommentPanelOpen: !isCommentPanelOpen});
  }

  isAnyFormTouched = () => {
    const {
      areasFormTouched,
      constructabilityFormTouched,
      contractsFormTouched,
      decisionsFormTouched,
      inspectionsFormTouched,
      leaseInfoFormTouched,
      rentsFormTouched,
      summaryFormTouched,
      tenantsFormTouched,
    } = this.props;

    return areasFormTouched ||
      constructabilityFormTouched ||
      contractsFormTouched ||
      decisionsFormTouched ||
      inspectionsFormTouched ||
      leaseInfoFormTouched ||
      rentsFormTouched ||
      summaryFormTouched ||
      tenantsFormTouched;
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
      attributes,
      comments,
      currentLease,
      isEditMode,
      isFetching,
    } = this.props;

    const areFormsValid = this.validateForms();
    const isAnyFormTouched = this.isAnyFormTouched();

    const areas = contentHelpers.getContentLeaseAreas(currentLease);

    let sum_areas = 0;
    areas && !!areas.length && areas.map((area) =>
      sum_areas = sum_areas + area.area
    );

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
          confirmButtonLabel='Vahvista'
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti peruuttaa muutokset?'
          onCancel={() => this.hideModal('CancelLease')}
          onClose={() => this.hideModal('CancelLease')}
          onSave={this.cancel}
          title='Peruuta muutokset'
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
              onCancelClick={isAnyFormTouched ? () => this.showModal('CancelLease') : this.cancel}
              onCommentClick={this.toggleCommentPanel}
              onEditClick={this.openEditMode}
              onSaveClick={() => this.showModal('SaveLease')}
            />
          }
          infoComponent={isEditMode
            ? <LeaseInfoEdit />
            : <LeaseInfo />
          }
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
              <h2>Vuokra-alue</h2>
              <RightSubtitle
                text={<span>{sum_areas} m<sup>2</sup></span>}
              />
              <Divider />
              {isEditMode
                ? <LeaseAreasEdit
                    attributes={attributes}
                    initialValues={{lease_areas: areas}}
                  />
                : <LeaseAreas
                    areas={areas}
                    attributes={attributes}
                  />
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
      const user = getLoggedInUser(state);
      return {
        areasFormTouched: getAreasFormTouched(state),
        areasFormValues: getAreasFormValues(state),
        attributes: getAttributes(state),
        comments: getComments(state),
        constructabilityFormTouched: getConstructabilityFormTouched(state),
        constructabilityFormValues: getFormValues(FormNames.CONSTRUCTABILITY)(state),
        contractsFormTouched: getContractsFormTouched(state),
        contractsFormValues: getFormValues(FormNames.CONTRACTS)(state),
        currentLease: getCurrentLease(state),
        decisionsFormTouched: getDecisionsFormTouched(state),
        decisionsFormValues: getFormValues(FormNames.DECISIONS)(state),
        inspectionFormTouched: getInspectionsFormTouched(state),
        inspectionsFormValues: getFormValues(FormNames.INSPECTION)(state),
        isEditMode: getIsEditMode(state),
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
        leaseInfoFormTouched: getLeaseInfoFormTouched(state),
        leaseInfoFormValues: getFormValues(FormNames.LEASE_INFO)(state),
        rentsFormTouched: getRentsFormTouched(state),
        rentsFormValues: getFormValues(FormNames.RENTS)(state),
        summaryFormTouched: getSummaryFormTouched(state),
        summaryFormValues: getFormValues(FormNames.SUMMARY)(state),
        tenantsFormTouched: getTenantsFormTouched(state),
        tenantsFormValues: getFormValues(FormNames.TENANTS)(state),
        user,
      };
    },
    {
      clearFormValidFlags,
      destroy,
      fetchAttributes,
      fetchCommentAttributes,
      fetchComments,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchInvoiceAttributes,
      fetchInvoices,
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
