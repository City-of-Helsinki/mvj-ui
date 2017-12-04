// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Column} from 'react-foundation';
import {formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
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
import PropertyUnit from './leaseSections/propertyUnit/PropertyUnit';
import PropertyUnitEdit from './leaseSections/propertyUnit/PropertyUnitEdit';
import RuleEdit from './leaseSections/contract/RuleEdit';
import Rules from './leaseSections/contract/Rules';
import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';
import TenantEdit from './leaseSections/tenant/TenantEdit';
import TenantTab from './leaseSections/tenant/TenantTab';
import type Moment from 'moment';

import mockData from '../mock-data.json';

type State = {
  activeTab: number,
  isEditMode: boolean,
  areas: Array<Object>,
  tenants: Array<Object>,
  contracts: Array<Object>,
  rules: Array<Object>,
  oldTenants: Array<Object>,
};

type Props = {
  start_date: ?Moment,
  end_date: ?Moment,
  areasForm: Array<Object>,
  currentLease: Object,
  leaseInfoErrors: Object,
  editLease: Function,
  fetchSingleLease: Function,
  isFetching: boolean,
  location: Object,
  params: Object,
  tenantsForm: Array<Object>,
}

class PreparerForm extends Component {
  state: State = {
    activeTab: 0,
    isEditMode: false,
    areas: [],
    tenants: [],
    oldTenants: [],
    contracts: [],
    terms: [],
    rules: [],
  }

  props: Props

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchSingleLease, location, params: {leaseId}} = this.props;

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
    this.setState({isEditMode: false});
  }

  save = () => {
    const {editLease, areasForm, currentLease, tenantsForm, start_date, end_date} = this.props;
    const payload = currentLease;
    payload.start_date = start_date ? moment(start_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
    payload.end_date = end_date ? moment(end_date, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;

    console.log(payload);

    editLease(payload);

    this.setState({areas: areasForm});
    this.setState({tenants: tenantsForm});
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
      return null;
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
                    end_date: currentLease.start_date ? moment(currentLease.end_date) : null,
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

const leaseInfoFormName = 'lease-info-edit-form';
const leaseInfoFormSelector = formValueSelector(leaseInfoFormName);

const areasFormName = 'property-unit-edit-form';
const areasFormSelector = formValueSelector(areasFormName);

const tenantFormName = 'tenant-edit-form';
const tenantFormSelector = formValueSelector(tenantFormName);

export default flowRight(
  withRouter,
  connect(
    (state) => {
      console.log(state);
      return {
        start_date: leaseInfoFormSelector(state, 'start_date'),
        end_date: leaseInfoFormSelector(state, 'end_date'),
        currentLease: getCurrentLease(state),
        isFetching: getIsFetching(state),
        leaseInfoErrors: getLeaseInfoErrors(state),
        areasForm: areasFormSelector(state, 'areas'),
        tenantsForm: tenantFormSelector(state, 'tenants'),
      };
    },
    {
      editLease,
      fetchSingleLease,
    }
  ),
)(PreparerForm);
