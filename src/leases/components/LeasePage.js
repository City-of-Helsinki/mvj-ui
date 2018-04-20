// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy} from 'redux-form';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {getLoggedInUser} from '$src/auth/selectors';
import {fetchUsers} from '$src/users/actions';
import {getUsers} from '$src/users/selectors';
import {
  fetchAttributes as fetchContactAttributes,
  fetchCompleteContactList,
} from '$src/contacts/actions';
import {getComments} from '$src/comments/selectors';
import {
  getAttributes as getContactAttributes,
  getCompleteContactList,
} from '$src/contacts/selectors';
import {fetchAttributes as fetchInvoiceAttributes, fetchInvoices} from '$src/invoices/actions';
import {
  getAreasFormTouched,
  getAreasFormValues,
  getAttributes,
  getContractsFormTouched,
  getContractsFormValues,
  getConstructabilityFormTouched,
  getConstructabilityFormValues,
  getCurrentLease,
  getDecisionsFormTouched,
  getDecisionsFormValues,
  getInspectionsFormTouched,
  getInspectionsFormValues,
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
  getLeaseInfoFormValues,
  getRentsFormTouched,
  getRentsFormValues,
  getSummaryFormTouched,
  getSummaryFormValues,
  getTenantsFormTouched,
  getTenantsFormValues,
} from '../selectors';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  showEditMode,
} from '../actions';
import {fetchAttributes as fetchCommentAttributes, fetchComments} from '$src/comments/actions';
import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import * as contentHelpers from '../helpers';
import {
  getAttributeFieldOptions,
  getLabelOfOption,
  getSearchQuery,
} from '$util/helpers';
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
import LeaseHistory from './leaseSections/summary/LeaseHistory';
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

import type {Attributes} from '../types';
import type {UserList} from '$src/users/types';
import type {CommentList} from '$src/comments/types';
import type {Attributes as ContactAttributes, Contact} from '$src/contacts/types';

import mockData from '../mock-data.json';

type Props = {
  allContacts: Array<Contact>,
  areasFormTouched: boolean,
  areasFormValues: Object,
  attributes: Attributes,
  clearFormValidFlags: Function,
  comments: CommentList,
  contactAttributes: ContactAttributes,
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
  users: UserList,
}

type State = {
  activeTab: number,
  history: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
};

class PreparerForm extends Component {
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
      clearFormValidFlags,
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
    // Destroy forms to initialize new values when data is fetched
    this.destroyAllForms();
    clearFormValidFlags();

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

    fetchCompleteContactList();
    fetchContactAttributes();
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

  cancel = () => {
    const {clearFormValidFlags, hideEditMode} = this.props;

    this.hideModal('CancelLease');
    this.destroyAllForms();
    clearFormValidFlags();
    hideEditMode();
  }

  save = () => {
    const {
      areasFormValues,
      leaseInfoFormValues,
      summaryFormValues,
      decisionsFormValues,
      contractsFormValues,
      inspectionsFormValues,
      constructabilityFormValues,
      rentsFormValues,
      tenantsFormValues,

      currentLease,
      patchLease,
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

  destroyAllForms = () => {
    const {destroy} = this.props;
    destroy('lease-areas-form');
    destroy('lease-info-form');
    destroy('summary-form');
    destroy('decisions-form');
    destroy('contracts-form');
    destroy('inspections-form');
    destroy('constructability-form');
    destroy('tenants-form');
    destroy('rents-form');
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
      allContacts,
      attributes,
      comments,
      contactAttributes,
      currentLease,
      isEditMode,
      isFetching,
      showEditMode,
      users,
    } = this.props;

    const areFormsValid = this.validateForms();
    const isAnyFormTouched = this.isAnyFormTouched();

    const classificationOptions = getAttributeFieldOptions(attributes, 'classification');

    const leaseInfo = contentHelpers.getContentLeaseInfo(currentLease);
    const summary = contentHelpers.getContentSummary(currentLease);
    const areas = contentHelpers.getContentLeaseAreas(currentLease);
    const decisions = contentHelpers.getContentDecisions(currentLease);
    const contracts = contentHelpers.getContentContracts(currentLease);
    const inspections = contentHelpers.getContentInspections(currentLease);
    const constructability = contentHelpers.getContentConstructability(currentLease);
    const tenants = contentHelpers.getContentTenants(currentLease);
    const rents = contentHelpers.getContentRents(currentLease);
    const basisOfRents = contentHelpers.getContentBasisOfRents(currentLease);

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
              onEditClick={() => {
                this.destroyAllForms();
                clearFormValidFlags();
                showEditMode();
              }}
              onSaveClick={() => this.showModal('SaveLease')}
            />
          }
          infoComponent={isEditMode
            ? (
              <LeaseInfoEdit
                attributes={attributes}
                initialValues={{
                  state: leaseInfo.state,
                  start_date: leaseInfo.start_date,
                  end_date: leaseInfo.end_date,
                }}
                leaseInfo={leaseInfo}
              />
            ) : (
              <LeaseInfo
                attributes={attributes}
                leaseInfo={leaseInfo}
              />
            )
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
              <h2>Yhteenveto</h2>
              {!isEditMode &&
                <RightSubtitle
                  className='publicity-label'
                  text={summary.classification
                    ? getLabelOfOption(classificationOptions, summary.classification)
                    : '-'
                  }
                />
              }
              <Divider />
              <Row>
                <Column medium={9}>
                  {isEditMode
                    ? <SummaryEdit
                        attributes={attributes}
                        initialValues={{...summary}}
                      />
                    : <Summary
                        attributes={attributes}
                        summary={summary}
                      />
                  }
                  </Column>
                <Column medium={3}>
                  <LeaseHistory history={history}/>
                </Column>
              </Row>
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
              <h2>Vuokralaiset</h2>
              <Divider />
              {isEditMode
                ? (
                  <TenantsEdit
                    allContacts={allContacts}
                    attributes={attributes}
                    contactAttributes={contactAttributes}
                    initialValues={{tenants: tenants}}
                  />
                )
                : (
                  <Tenants
                    allContacts={allContacts}
                    attributes={attributes}
                    contactAttributes={contactAttributes}
                    tenants={tenants}
                  />
                )
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? (
                  <RentsEdit
                    attributes={attributes}
                    initialValues={{
                      basis_of_rents: basisOfRents,
                      is_rent_info_complete: currentLease.is_rent_info_complete,
                      rents: rents,
                    }}
                  />
                ) : (
                  <Rents
                    attributes={attributes}
                    basisOfRents={basisOfRents}
                    isRentInfoComplete={currentLease.is_rent_info_complete}
                    rents={rents} />
                )
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? (
                  <DecisionsMainEdit
                    attributes={attributes}
                    contracts={contracts}
                    decisions={decisions}
                    inspections={inspections}
                  />
                ) : (
                  <DecisionsMain
                    attributes={attributes}
                    contracts={contracts}
                    decisions={decisions}
                    inspections={inspections}
                  />
                )
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <h2>Rakentamiskelpoisuus</h2>
              <Divider />
              {isEditMode
                ? (
                  <ConstructabilityEdit
                    areas={constructability}
                    attributes={attributes}
                    initialValues={{lease_areas: constructability}}
                    users={users}
                  />
                ) : (
                  <Constructability
                    areas={constructability}
                    attributes={attributes}
                    users={users}
                  />
                )
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              {isEditMode
                ? (
                  <InvoicesEdit
                    isInvoicingEnabled={currentLease.is_invoicing_enabled}
                  />
                )
                : (
                  <Invoices
                    isInvoicingEnabled={currentLease.is_invoicing_enabled}
                  />
                )
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
        allContacts: getCompleteContactList(state),
        areasFormTouched: getAreasFormTouched(state),
        areasFormValues: getAreasFormValues(state),
        attributes: getAttributes(state),
        comments: getComments(state),
        contactAttributes: getContactAttributes(state),
        contractsFormTouched: getContractsFormTouched(state),
        contractsFormValues: getContractsFormValues(state),
        currentLease: getCurrentLease(state),
        decisionsFormTouched: getDecisionsFormTouched(state),
        decisionsFormValues: getDecisionsFormValues(state),
        constructabilityFormTouched: getConstructabilityFormTouched(state),
        constructabilityFormValues: getConstructabilityFormValues(state),
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
        inspectionFormTouched: getInspectionsFormTouched(state),
        inspectionsFormValues: getInspectionsFormValues(state),
        isFetching: getIsFetching(state),
        leaseInfoFormTouched: getLeaseInfoFormTouched(state),
        leaseInfoFormValues: getLeaseInfoFormValues(state),
        rentsFormTouched: getRentsFormTouched(state),
        rentsFormValues: getRentsFormValues(state),
        summaryFormTouched: getSummaryFormTouched(state),
        summaryFormValues: getSummaryFormValues(state),
        tenantsFormTouched: getTenantsFormTouched(state),
        tenantsFormValues: getTenantsFormValues(state),
        user,
        users: getUsers(state),
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
      patchLease,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(PreparerForm);
