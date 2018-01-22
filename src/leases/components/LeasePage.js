// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy, formValueSelector, reduxForm, reset} from 'redux-form';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import moment from 'moment';

import {getAttributes, getCurrentLease, getIsFetching, getLeaseInfoErrors} from '../selectors';
import {editLease, fetchAttributes, fetchSingleLease} from '../actions';
import * as contentHelpers from '../helpers';

import CommentPanel from '../../components/commentPanel/CommentPanel';
import ConfirmationModal from '../../components/ConfirmationModal';
import ContractEdit from './leaseSections/contract/ContractEdit';
import Contracts from './leaseSections/contract/Contracts';
import ControlButtons from './ControlButtons';
import Inspections from './leaseSections/contract/Inspections';
import InspectionEdit from './leaseSections/contract/InspectionEdit';
import LeaseHistory from './leaseSections/summary/LeaseHistory';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '../../components/loader/Loader';
import PropertyUnit from './leaseSections/propertyUnit/PropertyUnit';
import PropertyUnitEdit from './leaseSections/propertyUnit/PropertyUnitEdit';
import RuleEdit from './leaseSections/contract/RuleEdit';
import Rules from './leaseSections/contract/Rules';
import Summary from './leaseSections/summary/Summary';
import SummaryEdit from './leaseSections/summary/SummaryEdit';
import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';
import TenantEdit from './leaseSections/tenant/TenantEdit';
import TenantTab from './leaseSections/tenant/TenantTab';
import ConstructionEligibilityTab from './leaseSections/constructionEligibility/ConstructionEligibilityTab';
import ConstructionEligibilityEdit from './leaseSections/constructionEligibility/ConstructionEligibilityEdit';
import MapLeasePage from './leaseSections/MapLeasePage';
import type Moment from 'moment';

import mockData from '../mock-data.json';

type State = {
  activeTab: number,
  areas: Array<Object>,
  comments: Array<Object>,
  contracts: Array<Object>,
  history: Array<Object>,
  inspections: Array<Object>,
  isEditMode: boolean,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
  oldTenants: Array<Object>,
  rules: Array<Object>,
  summary: Object,
  tenants: Array<Object>,
};

type Props = {
  areasForm: Array<Object>,
  areasTouched: boolean,
  attributes: Object,
  contractsForm: Array<Object>,
  contractsTouched: boolean,
  currentLease: Object,
  dispatch: Function,
  editLease: Function,
  eligibilityForm: Array<Object>,
  eligibilityTouched: boolean,
  end_date: ?Moment,
  fetchAttributes: Function,
  fetchSingleLease: Function,
  inspectionsForm: Array<Object>,
  inspectionTouched: boolean,
  isFetching: boolean,
  leaseInfoErrors: Object,
  leaseInfoTouched: boolean,
  location: Object,
  params: Object,
  rulesForm: Array<Object>,
  rulesTouched: boolean,
  start_date: ?Moment,
  status: string,
  summaryForm: Object,
  summaryTouched: boolean,
  tenantsForm: Array<Object>,
  tenantsTouched: boolean,
}

class PreparerForm extends Component {
  state: State = {
    activeTab: 0,
    areas: [],
    comments: [],
    contracts: [],
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isEditMode: false,
    isSaveLeaseModalOpen: false,
    oldTenants: [],
    rules: [],
    summary: {},
    tenants: [],
    terms: [],
    inspections: [],
  }

  props: Props

  commentPanel: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {dispatch, fetchAttributes, fetchSingleLease, location, params: {leaseId}} = this.props;

    // Destroy forms to initialize new values when data is fetched
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('inspections-edit-form'));
    dispatch(destroy('lease-info-edit-form'));
    dispatch(destroy('property-unit-edit-form'));
    dispatch(destroy('rule-edit-form'));
    dispatch(destroy('summary-edit-form'));
    dispatch(destroy('tenant-edit-form'));

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      areas: mockData.leases[0].lease_areas,
      comments: mockData.leases[0].comments,
      contracts: mockData.leases[0].contracts,
      history: mockData.leases[0].history,
      inspections: mockData.leases[0].inspections,
      oldTenants: mockData.leases[0].tenants_old,
      rules: mockData.leases[0].rules,
      summary: contentHelpers.getContentSummary(mockData.leases[0]),
      tenants: mockData.leases[0].tenants,
    });
    fetchAttributes();
    fetchSingleLease(leaseId);
  }

  openEditMode = () => {
    this.setState({isEditMode: true});
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
    const {dispatch} = this.props;
    this.setState({isEditMode: false});
    dispatch(reset('contract-edit-form'));
    dispatch(reset('inspection-edit-form'));
    dispatch(reset('lease-info-edit-form'));
    dispatch(reset('property-unit-edit-form'));
    dispatch(reset('rule-edit-form'));
    dispatch(reset('summary-edit-form'));
    dispatch(reset('tenant-edit-form'));

    this.hideModal('CancelLease');
  }

  save = () => {
    const {dispatch} = this.props;
    const {
      areasForm,
      contractsForm,
      currentLease,
      editLease,
      eligibilityForm,
      end_date,
      inspectionsForm,
      rulesForm,
      start_date,
      status,
      summaryForm,
      tenantsForm} = this.props;

    const payload = currentLease;
    payload.status = status;
    payload.start_date = start_date ? moment(start_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
    payload.end_date = end_date ? moment(end_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;

    editLease(payload);

    // TODO: Temporarily save changes to state. Replace with api call when end points are ready
    if(areasForm !== undefined) {
      this.setState({areas: areasForm});
    }
    if(eligibilityForm !== undefined) {
      this.setState({areas: eligibilityForm});
    }
    if(contractsForm !== undefined) {
      this.setState({contracts: contractsForm});
    }
    if(inspectionsForm !== undefined) {
      this.setState({inspections: inspectionsForm});
    }
    if(rulesForm !== undefined) {
      this.setState({rules: rulesForm});
    }
    if(summaryForm !== undefined) {
      this.setState({summary: summaryForm});
    }
    if(tenantsForm !== undefined) {
      this.setState({tenants: tenantsForm});
    }

    this.setState({isEditMode: false});
    this.hideModal('SaveLease');
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('inspection-edit-form'));
    dispatch(destroy('lease-info-edit-form'));
    dispatch(destroy('property-unit-edit-form'));
    dispatch(destroy('rule-edit-form'));
    dispatch(destroy('summary-edit-form'));
    dispatch(destroy('tenant-edit-form'));
  }

  validateForms = () => {
    const {leaseInfoErrors} = this.props;
    return leaseInfoErrors ? true : false;
  }

  addComment = (comment: string) => {
    const {comments} = this.state;
    comments.push({
      archived: false,
      date: moment().format('YYYY-MM-DD'),
      text: comment,
      user: 'Katja Immonen',
    });
    this.setState({comments: comments});
    this.commentPanel.resetField();
  }

  getComments = () => {
    const {comments} = this.state;
    return comments.sort(function(a, b){
      const keyA = a.date,
        keyB = b.date;
      if(moment(keyA).isAfter(keyB)) return -1;
      if(moment(keyB).isAfter(keyA)) return 1;
      return 0;
    });
  }

  getNotArchivedComments = (comments: Array<Object>) => {
    return comments.filter((comments) => {return comments.archived !== true;});
  }

  getArchivedComments = (comments: Array<Object>) => {
    return comments.filter((comments) => {return comments.archived === true;});
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
      areasTouched,
      contractsTouched,
      eligibilityTouched,
      inspectionTouched,
      leaseInfoTouched,
      rulesTouched,
      tenantsTouched,
    } = this.props;

    return areasTouched || contractsTouched || eligibilityTouched || inspectionTouched || leaseInfoTouched || rulesTouched ||tenantsTouched;
  }

  archiveComment = (comment: Object) => {
    const {comments} = this.state;
    const newComments = [];
    forEach(comments, (com) => {
      if(com === comment) {
        com.archived = true;
      }
      newComments.push(com);
    });
    this.setState({comments: newComments});
  }

  unarchiveComment = (comment: Object) => {
    const {comments} = this.state;
    const newComments = [];
    forEach(comments, (com) => {
      if(com === comment) {
        com.archived = false;
      }
      newComments.push(com);
    });
    this.setState({comments: newComments});
  }

  render() {
    const {
      activeTab,
      areas,
      contracts,
      history,
      inspections,
      isCancelLeaseModalOpen,
      isCommentPanelOpen,
      isEditMode,
      isSaveLeaseModalOpen,
      oldTenants,
      rules,
      summary,
      tenants,
    } = this.state;

    const {
      attributes,
      currentLease,
      isFetching,
    } = this.props;

    const areFormsValid = this.validateForms();
    const comments = this.getComments();
    const commentsNotArchived = this.getNotArchivedComments(comments);
    const commentsArchived = this.getArchivedComments(comments);
    const isAnyFormTouched = this.isAnyFormTouched();
    const leaseIdentifier = contentHelpers.getContentLeaseIdentifier(currentLease);
    const statusOptions = contentHelpers.getStatusOptions(attributes);

    if(isFetching) {
      return (
        <div className='lease-page'><Loader isLoading={true} /></div>
      );
    }

    return (
      <div className='lease-page'>
        <ConfirmationModal
          title='Tallenna'
          isOpen={isSaveLeaseModalOpen}
          label='Haluatko varmasti tallentaa muutokset?'
          onCancel={() => this.hideModal('SaveLease')}
          onClose={() => this.hideModal('SaveLease')}
          onSave={this.save}
        />
        <ConfirmationModal
          title='Peruuta muutokset'
          isOpen={isCancelLeaseModalOpen}
          label='Haluatko varmasti peruuttaa muutokset?'
          onCancel={() => this.hideModal('CancelLease')}
          onClose={() => this.hideModal('CancelLease')}
          onSave={this.cancel}
          saveButtonLabel='Vahvista'
        />
        <CommentPanel
          ref={(input) => {this.commentPanel = input;}}
          commentsNotArchived={commentsNotArchived}
          commentsArchived={commentsArchived}
          isOpen={isCommentPanelOpen}
          onAddComment={(comment) => this.addComment(comment)}
          onArchive={(comment) => this.archiveComment(comment)}
          onClose={this.toggleCommentPanel}
          onUnarchive={(comment) => this.unarchiveComment(comment)}
        />
        <Row>
          <Column className='lease-page__upper-bar'>
            <div className="lease-info-wrapper">
              {!isEditMode &&
                <LeaseInfo
                  identifier={leaseIdentifier}
                  startDate={get(currentLease, 'start_date')}
                  endDate={get(currentLease, 'end_date')}
                />
              }
              {isEditMode &&
                <LeaseInfoEdit
                  identifier={leaseIdentifier}
                  initialValues={{
                    status: currentLease.status ? currentLease.status : null,
                    start_date: currentLease.start_date ? moment(currentLease.start_date) : null,
                    end_date: currentLease.end_date ? moment(currentLease.end_date) : null,
                  }}
                  statusOptions={statusOptions}
                />
              }
            </div>
            <div className='controls'>
              <ControlButtons
                commentAmount={commentsNotArchived ? commentsNotArchived.length : 0}
                isEditMode={isEditMode}
                isValid={areFormsValid}
                onCancelClick={isAnyFormTouched ? () => this.showModal('CancelLease') : this.cancel}
                onCommentClick={this.toggleCommentPanel}
                onEditClick={this.openEditMode}
                onSaveClick={() => this.showModal('SaveLease')}
              />
            </div>
          </Column>
        </Row>

        <Row>
          <Column>
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
          </Column>
        </Row>

        <Row>
          <Column>
            <TabContent active={activeTab}>
              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Yhteenveto</h1>
                  <Row>
                    <Column medium={9}>
                      {!isEditMode && <Summary summary={summary}/>}
                      {isEditMode && <SummaryEdit initialValues={{summary: summary}}/>}
                    </Column>
                    <Column medium={3}>
                      <LeaseHistory history={history}/>
                    </Column>
                  </Row>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Vuokra-alue</h1>
                  <div className='property-unit'>
                    {isEditMode && <PropertyUnitEdit initialValues={{areas: areas}}/>}
                    {!isEditMode && <PropertyUnit areas={areas}/>}
                  </div>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Vuokralaiset</h1>
                  <div>
                    {!isEditMode && <TenantTab tenants={tenants} oldTenants={oldTenants}/>}
                    {isEditMode && <TenantEdit initialValues={{tenants: tenants}}/>}
                  </div>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Vuokra</h1>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Sopimukset</h1>
                  <div>
                    {!isEditMode && <Contracts contracts={contracts}/>}
                    {isEditMode && <ContractEdit rules={rules} initialValues={{contracts: contracts}}/>}
                  </div>
                  <h1>Päätökset</h1>
                  <div>
                    {!isEditMode && <Rules rules={rules}/>}
                    {isEditMode && <RuleEdit initialValues={{rules: rules}}/>}
                  </div>
                  <h1>Tarkastukset ja huomautukset</h1>
                  <div>
                    {!isEditMode && <Inspections inspections={inspections}/>}
                    {isEditMode && <InspectionEdit initialValues={{inspections: inspections}}/>}
                  </div>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Rakentamiskelpoisuus</h1>
                  <div>
                    {!isEditMode && <ConstructionEligibilityTab areas={areas}/>}
                    {isEditMode && <ConstructionEligibilityEdit areas={areas} initialValues={{areas: areas}}/>}
                  </div>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Laskutus</h1>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <MapLeasePage areas={areas}/>
                </div>
              </TabPane>
            </TabContent>
          </Column>
        </Row>
      </div>
    );
  }
}

const areasFormSelector = formValueSelector('property-unit-edit-form');
const contractFormSelector = formValueSelector('contract-edit-form');
const eligibilityFormSelector = formValueSelector('eligibility-edit-form');
const inspectionFormSelector = formValueSelector('inspection-edit-form');
const leaseInfoFormSelector = formValueSelector('lease-info-edit-form');
const ruleFormSelector = formValueSelector('rule-edit-form');
const summaryFormSelector = formValueSelector('summary-edit-form');
const tenantFormSelector = formValueSelector('tenant-edit-form');

export default flowRight(
  withRouter,
  reduxForm({
    form: 'lease-main-page-form',
  }),
  connect(
    (state) => {
      return {
        areasForm: areasFormSelector(state, 'areas'),
        areasTouched: get(state, 'form.property-unit-edit-form.anyTouched'),
        attributes: getAttributes(state),
        contractsForm: contractFormSelector(state, 'contracts'),
        contractsTouched: get(state, 'form.contract-edit-form.anyTouched'),
        currentLease: getCurrentLease(state),
        eligibilityForm: eligibilityFormSelector(state, 'areas'),
        eligibilityTouched: get(state, 'form.eligibility-edit-form.anyTouched'),
        end_date: leaseInfoFormSelector(state, 'end_date'),
        inspectionsForm: inspectionFormSelector(state, 'inspections'),
        inspectionTouched: get(state, 'form.inspection-edit-form.anyTouched'),
        isFetching: getIsFetching(state),
        leaseInfoErrors: getLeaseInfoErrors(state),
        leaseInfoTouched: get(state, 'form.lease-info-edit-form.anyTouched'),
        rulesForm: ruleFormSelector(state, 'rules'),
        rulesTouched: get(state, 'form.rule-edit-form.anyTouched'),
        start_date: leaseInfoFormSelector(state, 'start_date'),
        status: leaseInfoFormSelector(state, 'status'),
        summaryForm: summaryFormSelector(state, 'summary'),
        summaryTouched: get(state, 'form.summary-edit-form.anyTouched'),
        tenantsForm: tenantFormSelector(state, 'tenants'),
        tenantsTouched: get(state, 'form.tenant-edit-form.anyTouched'),
      };
    },
    {
      editLease,
      fetchAttributes,
      fetchSingleLease,
    }
  ),
)(PreparerForm);
