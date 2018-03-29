// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy, formValueSelector, reduxForm} from 'redux-form';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

import {getLoggedInUser} from '$src/auth/selectors';
import {receiveBilling} from './leaseSections/billing/actions';
import {getBilling} from './leaseSections/billing/selectors';
import {fetchUsers} from '$src/users/actions';
import {getUsers} from '$src/users/selectors';
import {
  fetchAttributes as fetchContactAttributes,
  fetchCompleteContactList,
} from '$src/contacts/actions';
import {
  getAttributes as getContactAttributes,
  getCompleteContactList,
} from '$src/contacts/selectors';
import {
  getAreasFormTouched,
  getAreasFormValues,
  getAttributes,
  getComments,
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
  getIsSummaryFormValid,
  getLeaseInfoFormTouched,
  getLeaseInfoFormValues,
  getSummaryFormTouched,
  getSummaryFormValues,
} from '../selectors';
import {
  clearFormValidFlags,
  fetchAttributes,
  fetchComments,
  fetchSingleLease,
  hideEditMode,
  patchLease,
  showEditMode,
} from '../actions';
import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import * as contentHelpers from '../helpers';
import {
  displayUIMessage,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';

import Billing from './leaseSections/billing/Billing';
import BillingEdit from './leaseSections/billing/BillingEdit';
import CommentPanel from '$components/commentPanel/CommentPanel';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtons from '$components/controlButtons/ControlButtons';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import DecisionsMain from './leaseSections/contract/DecisionsMain';
import DecisionsMainEdit from './leaseSections/contract/DecisionsMainEdit';
import Divider from '$components/content/Divider';
import EditableMap from '$components/map/EditableMap';
import LeaseAreas from './leaseSections/leaseArea/LeaseAreas';
import LeaseAreasEdit from './leaseSections/leaseArea/LeaseAreasEdit';
import LeaseHistory from './leaseSections/summary/LeaseHistory';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Rent from './leaseSections/rent/Rent';
import RentEdit from './leaseSections/rent/RentEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '$components/tabs/Tabs';
import TabPane from '$components/tabs/TabPane';
import TabContent from '$components/tabs/TabContent';
import TenantsEdit from './leaseSections/tenant/TenantsEdit';
import Tenants from './leaseSections/tenant/Tenants';
import Constructability from './leaseSections/constructability/Constructability';
import ConstructabilityEdit from './leaseSections/constructability/ConstructabilityEdit';

import type {UserList} from '$src/users/types';
import type {
  Attributes as ContactAttributes,
  ContactList,
} from '$src/contacts/types';

import mockData from '../mock-data.json';

type Props = {
  allContacts: ContactList,
  areasFormTouched: boolean,
  areasFormValues: Object,
  attributes: Object,
  billing: Object,
  clearFormValidFlags: Function,
  commentsStore: Array<Object>,
  contactAttributes: ContactAttributes,
  contractsFormTouched: boolean,
  contractsFormValues: Object,
  constructabilityFormTouched: boolean,
  constructabilityFormValues: Object,
  currentLease: Object,
  decisionsFormTouched: boolean,
  decisionsFormValues: Object,
  dispatch: Function,
  fetchAttributes: Function,
  fetchComments: Function,
  fetchCompleteContactList: Function,
  fetchContactAttributes: Function,
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
  isSummaryFormValid: boolean,
  leaseInfoFormTouched: boolean,
  leaseInfoFormValues: Object,
  location: Object,
  params: Object,
  patchLease: Function,
  receiveBilling: Function,
  receiveTopNavigationSettings: Function,
  rentsForm: Object,
  rentsTouched: boolean,
  showEditMode: Function,
  summaryFormTouched: boolean,
  summaryFormValues: Object,
  tenantsForm: Array<Object>,
  tenantsTouched: boolean,
  user: Object,
  users: UserList,
}

type State = {
  activeTab: number,
  history: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
  rents: Object,
};

class PreparerForm extends Component {
  props: Props

  state: State = {
    activeTab: 0,
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isSaveLeaseModalOpen: false,
    rents: {},
    terms: [],
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      clearFormValidFlags,
      fetchAttributes,
      fetchComments,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchSingleLease,
      fetchUsers,
      location,
      params: {leaseId},
      receiveBilling,
      receiveTopNavigationSettings,
    } = this.props;
    const lease = mockData.leases[0];

    receiveTopNavigationSettings({
      linkUrl: getRouteById('leases'),
      pageTitle: 'Vuokraukset',
      showSearch: true,
    });

    // Destroy forms to initialize new values when data is fetched
    this.destroyAllForms();
    clearFormValidFlags();

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      history: contentHelpers.getContentHistory(lease),
      rents: contentHelpers.getContentRents(lease),
    });
    receiveBilling(contentHelpers.getContentBilling(lease));
    fetchAttributes();
    fetchComments(leaseId);
    fetchSingleLease(leaseId);

    fetchUsers();
    fetchCompleteContactList();
    fetchContactAttributes();
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
    hideEditMode();
    this.hideModal('CancelLease');
    this.destroyAllForms();
    clearFormValidFlags();
  }

  save = () => {
    const {
      clearFormValidFlags,
      areasFormValues,
      leaseInfoFormValues,
      summaryFormValues,
      decisionsFormValues,
      contractsFormValues,
      inspectionsFormValues,
      constructabilityFormValues,

      currentLease,
      hideEditMode,
      patchLease,
      rentsForm,
      // tenantsForm,
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

    patchLease(payload);

    // TODO: Temporarily save changes to state. Replace with api call when end points are ready
    if(rentsForm !== undefined) {
      this.setState({rents: rentsForm});
    }

    // if(tenantsForm !== undefined) {
    //   this.setState({tenants: tenantsForm});
    // }

    hideEditMode();
    this.hideModal('SaveLease');

    this.destroyAllForms();
    clearFormValidFlags();
  }

  agreeCriteria = (criteria: Object) => {
    const {rents, rents: {criterias}} = this.state;
    forEach(criterias, (x) => {
      if(x === criteria) {
        x.agreed = true;
      }
    });
    this.setState({rents: rents});
    displayUIMessage({title: 'Vuokranperuste hyväksytty', body: 'Vuokranperuste on hyväksytty onnistuneesti'});
  }

  destroyAllForms = () => {
    const {dispatch} = this.props;
    dispatch(destroy('lease-areas-form'));
    dispatch(destroy('lease-info-form'));
    dispatch(destroy('summary-form'));
    dispatch(destroy('decisions-form'));
    dispatch(destroy('contracts-form'));
    dispatch(destroy('inspections-form'));
    dispatch(destroy('constructability-form'));

    dispatch(destroy('billing-edit-form'));
    dispatch(destroy('rent-edit-form'));
    dispatch(destroy('tenants-form'));
  }

  validateForms = () => {
    const {
      isConstructabilityFormValid,
      isContractsFormValid,
      isDecisionsFormValid,
      isInspectionsFormValid,
      isLeaseAreasFormValid,
      isLeaseInfoFormValid,
      isSummaryFormValid,
    } = this.props;

    return (
      isConstructabilityFormValid &&
      isContractsFormValid &&
      isDecisionsFormValid &&
      isInspectionsFormValid &&
      isLeaseAreasFormValid &&
      isLeaseInfoFormValid &&
      isSummaryFormValid
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
      leaseInfoFormTouched,
      summaryFormTouched,
      decisionsFormTouched,
      contractsFormTouched,
      inspectionsFormTouched,
      constructabilityFormTouched,

      rentsTouched,
      tenantsTouched,
    } = this.props;

    return areasFormTouched ||
      leaseInfoFormTouched ||
      summaryFormTouched ||
      decisionsFormTouched ||
      contractsFormTouched ||
      inspectionsFormTouched ||
      constructabilityFormTouched ||

      rentsTouched ||
      tenantsTouched;
  }

  render() {
    const {
      activeTab,
      history,
      isCancelLeaseModalOpen,
      isCommentPanelOpen,
      isSaveLeaseModalOpen,
      rents,
    } = this.state;

    const {
      allContacts,
      attributes,
      billing,
      commentsStore,
      contactAttributes,
      currentLease,
      dispatch,
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

    const comments = contentHelpers.getContentComments(commentsStore);

    let sum_areas = 0;
    areas && areas.length > 0 && areas.map((area) =>
      sum_areas = sum_areas + area.area
    );

    if(isFetching) {
      return (
        <div className='lease-page'><Loader isLoading={true} /></div>
      );
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
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti peruuttaa muutokset?'
          onCancel={() => this.hideModal('CancelLease')}
          onClose={() => this.hideModal('CancelLease')}
          onSave={this.cancel}
          saveButtonLabel='Vahvista'
          title='Peruuta muutokset'
        />
        <CommentPanel
          comments={comments}
          dispatch={dispatch}
          isOpen={isCommentPanelOpen}
          onClose={this.toggleCommentPanel}
        />
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              commentAmount={comments ? comments.length : 0}
              isCancelDisabled={activeTab.toString() === '6'}
              isEditDisabled={activeTab.toString() === '6'}
              isEditMode={isEditMode}
              isSaveDisabled={!areFormsValid || activeTab.toString() === '6'}
              onCancelClick={isAnyFormTouched ? () => this.showModal('CancelLease') : this.cancel}
              onCommentClick={this.toggleCommentPanel}
              onEditClick={showEditMode}
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
            'Vuokra',
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
              <h1>Yhteenveto</h1>
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
              <h1>Vuokra-alue</h1>
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
              <h1>Vuokralaiset</h1>
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
                ? <RentEdit initialValues={{rents: rents}}/>
                : <Rent onCriteriaAgree={(criteria) => this.agreeCriteria(criteria)} rents={rents}/>
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
              <h1>Rakentamiskelpoisuus</h1>
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
                ? <BillingEdit billing={billing}/>
                : <Billing billing={billing}/>
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

const rentFormSelector = formValueSelector('rent-edit-form');
const tenantFormSelector = formValueSelector('tenants-form');

export default flowRight(
  withRouter,
  reduxForm({
    form: 'lease-main-page-form',
  }),
  connect(
    (state) => {
      const user = getLoggedInUser(state);
      return {
        allContacts: getCompleteContactList(state),
        areasFormTouched: getAreasFormTouched(state),
        areasFormValues: getAreasFormValues(state),
        attributes: getAttributes(state),
        billing: getBilling(state),
        commentsStore: getComments(state),
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
        isSummaryFormValid: getIsSummaryFormValid(state),
        inspectionFormTouched: getInspectionsFormTouched(state),
        inspectionsFormValues: getInspectionsFormValues(state),
        isFetching: getIsFetching(state),
        leaseInfoFormTouched: getLeaseInfoFormTouched(state),
        leaseInfoFormValues: getLeaseInfoFormValues(state),
        rentsForm: rentFormSelector(state, 'rents'),
        rentsTouched: get(state, 'form.rent-edit-form.anyTouched'),
        summaryFormTouched: getSummaryFormTouched(state),
        summaryFormValues: getSummaryFormValues(state),
        tenantsForm: tenantFormSelector(state, 'tenants'),
        tenantsTouched: get(state, 'form.tenants-form.anyTouched'),
        user,
        users: getUsers(state),
      };
    },
    {
      clearFormValidFlags,
      fetchAttributes,
      fetchComments,
      fetchCompleteContactList,
      fetchContactAttributes,
      fetchSingleLease,
      fetchUsers,
      hideEditMode,
      patchLease,
      receiveBilling,
      receiveTopNavigationSettings,
      showEditMode,
    }
  ),
)(PreparerForm);
