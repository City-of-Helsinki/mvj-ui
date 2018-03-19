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

import {getLoggedInUser} from '$src/auth/selectors';
import {receiveBilling} from './leaseSections/billing/actions';
import {getBilling} from './leaseSections/billing/selectors';
import {
  getAttributes,
  getComments,
  getCurrentLease,
  getIsEditMode,
  getIsFetching,
  getLeaseInfoErrors,
} from '../selectors';
import {
  archiveComment,
  createComment,
  deleteComment,
  editComment,
  editLease,
  fetchAttributes,
  fetchSingleLease,
  hideEditMode,
  showEditMode,
  unarchiveComment,
} from '../actions';
import {getRouteById} from '$src/root/routes';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import * as contentHelpers from '../helpers';
import {displayUIMessage, getLabelOfOption} from '$util/helpers';
import {summaryPublicityOptions} from './leaseSections/constants';

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
import LeaseHistory from './leaseSections/summary/LeaseHistory';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import PropertyUnit from './leaseSections/propertyUnit/PropertyUnit';
import PropertyUnitEdit from './leaseSections/propertyUnit/PropertyUnitEdit';
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
import ConstructionEligibility from './leaseSections/constructionEligibility/ConstructionEligibility';
import ConstructionEligibilityEdit from './leaseSections/constructionEligibility/ConstructionEligibilityEdit';


import mockData from '../mock-data.json';

type Props = {
  archiveComment: Function,
  areasForm: Array<Object>,
  areasTouched: boolean,
  attributes: Object,
  billing: Object,
  comments: Array<Object>,
  contractsForm: Array<Object>,
  contractsTouched: boolean,
  createComment: Function,
  currentLease: Object,
  deleteComment: Function,
  dispatch: Function,
  editComment: Function,
  editLease: Function,
  eligibilityForm: Array<Object>,
  eligibilityTouched: boolean,
  end_date: ?string,
  fetchAttributes: Function,
  fetchSingleLease: Function,
  hideEditMode: Function,
  inspectionsForm: Array<Object>,
  inspectionTouched: boolean,
  isEditMode: boolean,
  isFetching: boolean,
  leaseInfoErrors: Object,
  leaseInfoTouched: boolean,
  location: Object,
  params: Object,
  receiveBilling: Function,
  receiveTopNavigationSettings: Function,
  rentsForm: Object,
  rentsTouched: boolean,
  rulesForm: Array<Object>,
  rulesTouched: boolean,
  showEditMode: Function,
  start_date: ?string,
  status: string,
  summaryForm: Object,
  summaryTouched: boolean,
  tenantsForm: Array<Object>,
  tenantsTouched: boolean,
  user: Object,
  unarchiveComment: Function,
}

type State = {
  activeTab: number,
  areas: Array<Object>,
  contracts: Array<Object>,
  history: Array<Object>,
  inspections: Array<Object>,
  isCancelLeaseModalOpen: boolean,
  isCommentPanelOpen: boolean,
  isSaveLeaseModalOpen: boolean,
  oldTenants: Array<Object>,
  rents: Object,
  rules: Array<Object>,
  summary: Object,
  tenants: Array<Object>,
};

class PreparerForm extends Component {
  props: Props

  state: State = {
    activeTab: 0,
    areas: [],
    contracts: [],
    history: [],
    isCancelLeaseModalOpen: false,
    isCommentPanelOpen: false,
    isSaveLeaseModalOpen: false,
    oldTenants: [],
    rents: {},
    rules: [],
    summary: {},
    tenants: [],
    terms: [],
    inspections: [],
  }

  commentPanel: any

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {
      dispatch,
      fetchAttributes,
      fetchSingleLease,
      location, params: {leaseId},
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
    dispatch(destroy('billing-edit-form'));
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('inspections-edit-form'));
    dispatch(destroy('lease-info-edit-form'));
    dispatch(destroy('property-unit-edit-form'));
    dispatch(destroy('rent-edit-form'));
    dispatch(destroy('rule-edit-form'));
    dispatch(destroy('summary-edit-form'));
    dispatch(destroy('tenant-edit-form'));

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      areas: contentHelpers.getContentLeaseAreas(lease),
      contracts: contentHelpers.getContentContracts(lease),
      history: contentHelpers.getContentHistory(lease),
      inspections: contentHelpers.getContentInspections(lease),
      oldTenants: lease.tenants_old,
      rents: contentHelpers.getContentRents(lease),
      rules: contentHelpers.getContentRules(lease),
      summary: contentHelpers.getContentSummary(lease),
      tenants: contentHelpers.getContentTenants(lease),
    });
    receiveBilling(contentHelpers.getContentBilling(lease));
    fetchAttributes();
    fetchSingleLease(leaseId);
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
    const {hideEditMode} = this.props;
    this.resetAllForms();
    hideEditMode();
    this.hideModal('CancelLease');
  }

  save = () => {
    const {
      areasForm,
      contractsForm,
      currentLease,
      editLease,
      eligibilityForm,
      end_date,
      hideEditMode,
      inspectionsForm,
      rentsForm,
      rulesForm,
      start_date,
      status,
      summaryForm,
      tenantsForm,
    } = this.props;

    const payload = currentLease;
    payload.status = status;
    payload.start_date = start_date;
    payload.end_date = end_date;

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
    if(rentsForm !== undefined) {
      this.setState({rents: rentsForm});
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

    hideEditMode();
    this.hideModal('SaveLease');
    this.destroyAllForms();
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
    dispatch(destroy('billing-edit-form'));
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('inspection-edit-form'));
    dispatch(destroy('lease-info-edit-form'));
    dispatch(destroy('property-unit-edit-form'));
    dispatch(destroy('rent-edit-form'));
    dispatch(destroy('rule-edit-form'));
    dispatch(destroy('summary-edit-form'));
    dispatch(destroy('tenant-edit-form'));
  }

  resetAllForms = () => {
    const {dispatch} = this.props;
    dispatch(reset('billing-edit-form'));
    dispatch(reset('contract-edit-form'));
    dispatch(reset('inspection-edit-form'));
    dispatch(reset('lease-info-edit-form'));
    dispatch(reset('property-unit-edit-form'));
    dispatch(reset('rent-edit-form'));
    dispatch(reset('rule-edit-form'));
    dispatch(reset('summary-edit-form'));
    dispatch(reset('tenant-edit-form'));
  }

  validateForms = () => {
    const {leaseInfoErrors} = this.props;
    return leaseInfoErrors ? false : true;
  }

  addComment = (text: string, type: string) => {
    const {createComment, user} = this.props;
    const comment = {
      archived: false,
      date: moment().format('YYYY-MM-DD'),
      text: text,
      type: type,
      user: get(user, 'profile.name'),
    };
    createComment(comment);
    this.commentPanel.getWrappedInstance().resetNewCommentField();
  }

  archiveComment = (comment: Object) => {
    const {archiveComment} = this.props;
    comment.archived = true;
    archiveComment(comment);
  }

  deleteComment = (comment: Object) => {
    const {deleteComment} = this.props;
    deleteComment(comment);
  }

  editComment = (comment: Object, newText: string) => {
    const {editComment} = this.props;
    comment.text = newText;
    editComment(comment);
  }

  unarchiveComment = (comment: Object) => {
    const {unarchiveComment} = this.props;
    comment.archived = false;
    unarchiveComment(comment);
  }

  sortComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {
      return [];
    }

    return comments.sort(function(a, b){
      const keyA = a.date,
        keyB = b.date;
      if(moment(keyA).isAfter(moment(keyB))) return -1;
      if(moment(keyB).isAfter(moment(keyA))) return 1;
      return 0;
    });
  }

  getCurrentComments = (comments: Array<Object>) => {
    if(!comments || !comments.length) {return [];}
    return comments.filter((comments) => {return comments.archived !== true;});
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
      rentsTouched,
      rulesTouched,
      tenantsTouched,
    } = this.props;

    return areasTouched ||
      contractsTouched ||
      eligibilityTouched ||
      inspectionTouched ||
      leaseInfoTouched ||
      rentsTouched ||
      rulesTouched ||
      tenantsTouched;
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
      isSaveLeaseModalOpen,
      oldTenants,
      rents,
      rules,
      summary,
      tenants,
    } = this.state;

    const {
      attributes,
      billing,
      comments,
      currentLease,
      isEditMode,
      isFetching,
      showEditMode,
    } = this.props;

    const areFormsValid = this.validateForms();
    const sortedComments = this.sortComments(comments);
    const currentComments = this.getCurrentComments(sortedComments);
    const isAnyFormTouched = this.isAnyFormTouched();
    const leaseIdentifier = contentHelpers.getContentLeaseIdentifier(currentLease);
    const statusOptions = contentHelpers.getStatusOptions(attributes);

    let sum_areas = 0;
    areas && areas.length > 0 && areas.map((area) =>
      sum_areas = sum_areas + area.full_area
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
          comments={sortedComments}
          isOpen={isCommentPanelOpen}
          onAddComment={(text, type) => this.addComment(text, type)}
          onArchive={(comment) => this.archiveComment(comment)}
          onClose={this.toggleCommentPanel}
          onDelete={(comment) => this.deleteComment(comment)}
          onEdit={(comment, newText) => this.editComment(comment, newText)}
          onUnarchive={(comment) => this.unarchiveComment(comment)}
          ref={(input) => {this.commentPanel = input;}}
        />
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              commentAmount={currentComments ? currentComments.length : 0}
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
                identifier={leaseIdentifier}
                initialValues={{
                  status: currentLease.status,
                  start_date: currentLease.start_date,
                  end_date: currentLease.end_date,
                }}
                statusOptions={statusOptions}
              />
            ) : (
              <LeaseInfo
                identifier={leaseIdentifier}
                startDate={currentLease.start_date}
                endDate={currentLease.end_date}
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
                  text={summary.publicity
                    ? getLabelOfOption(summaryPublicityOptions, summary.publicity)
                    : '-'
                  }
                />
              }
              <Divider />
              <Row>
                <Column medium={9}>
                  {isEditMode
                    ? <SummaryEdit initialValues={{summary: summary}}/>
                    : <Summary summary={summary}/>
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
                ? <PropertyUnitEdit initialValues={{areas: areas}}/>
                : <PropertyUnit areas={areas}/>
              }
            </ContentContainer>
          </TabPane>

          <TabPane className="lease-page__tab-content">
            <ContentContainer>
              <h1>Vuokralaiset</h1>
              <Divider />
              {isEditMode
                ? <TenantsEdit initialValues={{tenants: tenants}} />
                : <Tenants tenants={tenants} oldTenants={oldTenants} />
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
                    contracts={contracts}
                    inspections={inspections}
                    rules={rules}
                  />
                ) : (
                  <DecisionsMain
                    contracts={contracts}
                    inspections={inspections}
                    rules={rules}
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
                ? <ConstructionEligibilityEdit areas={areas} initialValues={{areas: areas}}/>
                : <ConstructionEligibility areas={areas}/>
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

const areasFormSelector = formValueSelector('property-unit-edit-form');
const contractFormSelector = formValueSelector('contract-edit-form');
const eligibilityFormSelector = formValueSelector('eligibility-edit-form');
const inspectionFormSelector = formValueSelector('inspection-edit-form');
const leaseInfoFormSelector = formValueSelector('lease-info-edit-form');
const rentFormSelector = formValueSelector('rent-edit-form');
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
      const user = getLoggedInUser(state);
      return {
        areasForm: areasFormSelector(state, 'areas'),
        areasTouched: get(state, 'form.property-unit-edit-form.anyTouched'),
        attributes: getAttributes(state),
        billing: getBilling(state),
        comments: getComments(state),
        contractsForm: contractFormSelector(state, 'contracts'),
        contractsTouched: get(state, 'form.contract-edit-form.anyTouched'),
        currentLease: getCurrentLease(state),
        eligibilityForm: eligibilityFormSelector(state, 'areas'),
        eligibilityTouched: get(state, 'form.eligibility-edit-form.anyTouched'),
        end_date: leaseInfoFormSelector(state, 'end_date'),
        isEditMode: getIsEditMode(state),
        inspectionsForm: inspectionFormSelector(state, 'inspections'),
        inspectionTouched: get(state, 'form.inspection-edit-form.anyTouched'),
        isFetching: getIsFetching(state),
        leaseInfoErrors: getLeaseInfoErrors(state),
        leaseInfoTouched: get(state, 'form.lease-info-edit-form.anyTouched'),
        rentsForm: rentFormSelector(state, 'rents'),
        rentsTouched: get(state, 'form.rent-edit-form.anyTouched'),
        rulesForm: ruleFormSelector(state, 'rules'),
        rulesTouched: get(state, 'form.rule-edit-form.anyTouched'),
        start_date: leaseInfoFormSelector(state, 'start_date'),
        status: leaseInfoFormSelector(state, 'status'),
        summaryForm: summaryFormSelector(state, 'summary'),
        summaryTouched: get(state, 'form.summary-edit-form.anyTouched'),
        tenantsForm: tenantFormSelector(state, 'tenants'),
        tenantsTouched: get(state, 'form.tenant-edit-form.anyTouched'),
        user,
      };
    },
    {
      archiveComment,
      createComment,
      deleteComment,
      editComment,
      editLease,
      fetchAttributes,
      fetchSingleLease,
      hideEditMode,
      receiveBilling,
      receiveTopNavigationSettings,
      showEditMode,
      unarchiveComment,
    }
  ),
)(PreparerForm);
