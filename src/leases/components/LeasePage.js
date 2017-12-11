// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {destroy, formValueSelector, reduxForm, reset} from 'redux-form';
import {withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import moment from 'moment';

import {getCurrentLease, getIsFetching, getLeaseInfoErrors} from '../selectors';
import {editLease, fetchSingleLease} from '../actions';
import * as contentHelpers from '../helpers';

import ContractEdit from './leaseSections/contract/ContractEdit';
import Contracts from './leaseSections/contract/Contracts';
import ControlButtons from './ControlButtons';
import LeaseInfo from './leaseSections/leaseInfo/LeaseInfo';
import LeaseInfoEdit from './leaseSections/leaseInfo/LeaseInfoEdit';
import Loader from '../../components/loader/Loader';
import PropertyUnit from './leaseSections/propertyUnit/PropertyUnit';
import PropertyUnitEdit from './leaseSections/propertyUnit/PropertyUnitEdit';
import RuleEdit from './leaseSections/contract/RuleEdit';
import Rules from './leaseSections/contract/Rules';
import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';
import TenantEdit from './leaseSections/tenant/TenantEdit';
import TenantTab from './leaseSections/tenant/TenantTab';
import ConstructionEligibilityTab from './leaseSections/constructionEligibility/ConstructionEligibilityTab';
import ConstructionEligibilityEdit from './leaseSections/constructionEligibility/ConstructionEligibilityEdit';
import type Moment from 'moment';

import mockData from '../mock-data.json';

type State = {
  activeTab: number,
  areas: Array<Object>,
  contracts: Array<Object>,
  isEditMode: boolean,
  oldTenants: Array<Object>,
  rules: Array<Object>,
  tenants: Array<Object>,
};

type Props = {
  areasForm: Array<Object>,
  eligibilityForm: Array<Object>,
  contractsForm: Array<Object>,
  currentLease: Object,
  dispatch: Function,
  editLease: Function,
  end_date: ?Moment,
  fetchSingleLease: Function,
  isFetching: boolean,
  leaseInfoErrors: Object,
  location: Object,
  params: Object,
  rulesForm: Array<Object>,
  start_date: ?Moment,
  tenantsForm: Array<Object>,
  contractsForm: Array<Object>,
  rulesForm: Array<Object>,
}

class PreparerForm extends Component {
  state: State = {
    activeTab: 0,
    areas: [],
    contracts: [],
    isEditMode: false,
    oldTenants: [],
    rules: [],
    tenants: [],
    terms: [],
  }

  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {dispatch, fetchSingleLease, location, params: {leaseId}} = this.props;

    // Destroy forms to initialize new values when data is fetched
    dispatch(destroy('lease-info-edit-form'));
    dispatch(destroy('property-unit-edit-form'));
    dispatch(destroy('tenant-edit-form'));
    dispatch(destroy('contract-edit-form'));
    dispatch(destroy('rule-edit-form'));

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    this.setState({
      areas: mockData.leases[0].lease_areas,
      tenants: mockData.leases[0].tenants,
      oldTenants: mockData.leases[0].tenants_old,
      contracts: mockData.leases[0].contracts,
      rules: mockData.leases[0].rules,
    });
    fetchSingleLease(leaseId);
  }

  openEditMode = () => {
    this.setState({isEditMode: true});
  }

  cancel = () => {
    const {dispatch} = this.props;
    this.setState({isEditMode: false});
    dispatch(reset('lease-info-edit-form'));
    dispatch(reset('property-unit-edit-form'));
    dispatch(reset('tenant-edit-form'));
    dispatch(reset('contract-edit-form'));
    dispatch(reset('rule-edit-form'));
  }

  save = () => {
    const {editLease, areasForm, currentLease, tenantsForm, start_date, end_date, rulesForm, contractsForm, eligibilityForm} = this.props;
    const payload = currentLease;
    payload.start_date = start_date ? moment(start_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
    payload.end_date = end_date ? moment(end_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;

    editLease(payload);

    this.setState({areas: areasForm});
    this.setState({areas: eligibilityForm});
    this.setState({tenants: tenantsForm});
    this.setState({rules: rulesForm});
    this.setState({contracts: contractsForm});

    // TODO: Temporarily save changes to state. Replace with api call when end points are ready
    if(areasForm !== undefined) {
      this.setState({areas: areasForm});
    }
    if(contractsForm !== undefined) {
      this.setState({contracts: contractsForm});
    }
    if(rulesForm !== undefined) {
      this.setState({rules: rulesForm});
    }
    if(tenantsForm !== undefined) {
      this.setState({tenants: tenantsForm});
    }

    this.setState({isEditMode: false});
  }

  openCommentPanel = () => {
    alert('open comment panel');
  }

  validateForms = () => {
    const {leaseInfoErrors} = this.props;
    return leaseInfoErrors ? true : false;
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

  render() {
    const {
      activeTab,
      areas,
      contracts,
      isEditMode,
      oldTenants,
      tenants,
      rules,
    } = this.state;
    const {
      currentLease,
      isFetching,
    } = this.props;

    const areFormsValid = this.validateForms();

    const leaseIdentifier = contentHelpers.getContentLeaseIdentifier(currentLease);

    if(isFetching) {
      return (
        <div className='lease-page'><Loader isLoading={true} /></div>
      );
    }

    return (
      <div className='lease-page'>
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
                    start_date: currentLease.start_date ? moment(currentLease.start_date) : null,
                    end_date: currentLease.end_date ? moment(currentLease.end_date) : null,
                  }}
                />
              }
            </div>
            <div className='controls'>
              <ControlButtons
                isEditMode={isEditMode}
                isValid={areFormsValid}
                onEditClick={this.openEditMode}
                onCancelClick={this.cancel}
                onSaveClick={this.save}
                onCommentClick={this.openCommentPanel}
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
                    {isEditMode && <ContractEdit initialValues={{contracts: contracts}}/>}
                  </div>
                  <h1>Päätökset</h1>
                  <div>
                    {!isEditMode && <Rules rules={rules}/>}
                    {isEditMode && <RuleEdit initialValues={{rules: rules}}/>}
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
                  <h1>Kartta</h1>
                </div>
              </TabPane>
            </TabContent>
          </Column>
        </Row>
      </div>
    );
  }
}

const leaseInfoFormSelector = formValueSelector('lease-info-edit-form');
const areasFormSelector = formValueSelector('property-unit-edit-form');
const tenantFormSelector = formValueSelector('tenant-edit-form');
const contractFormSelector = formValueSelector('contract-edit-form');
const ruleFormSelector = formValueSelector('rule-edit-form');

const eligibilityFormName = 'eligibility-edit-form';
const eligibilityFormSelector = formValueSelector(eligibilityFormName);

export default flowRight(
  withRouter,
  reduxForm({
    form: 'lease-main-page-form',
  }),
  connect(
    (state) => {
      return {
        areasForm: areasFormSelector(state, 'areas'),
        contractsForm: contractFormSelector(state, 'contracts'),
        currentLease: getCurrentLease(state),
        end_date: leaseInfoFormSelector(state, 'end_date'),
        isFetching: getIsFetching(state),
        leaseInfoErrors: getLeaseInfoErrors(state),
        areasForm: areasFormSelector(state, 'areas'),
        eligibilityForm: eligibilityFormSelector(state, 'areas'),
        tenantsForm: tenantFormSelector(state, 'tenants'),
        contractsForm: contractFormSelector(state, 'contracts'),=======
        rulesForm: ruleFormSelector(state, 'rules'),
        start_date: leaseInfoFormSelector(state, 'start_date'),
        tenantsForm: tenantFormSelector(state, 'tenants'),
      };
    },
    {
      editLease,
      fetchSingleLease,
    }
  ),
)(PreparerForm);
