// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';
import {formValueSelector} from 'redux-form';

import {getCurrentLease, getIsFetching} from '../selectors';
import {fetchSingleLease} from '../actions';

import ControlButtons from './ControlButtons';
import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';
import PropertyUnit from './leaseSections/propertyUnit/PropertyUnit';
import PropertyUnitEdit from './leaseSections/propertyUnit/PropertyUnitEdit';
import TenantEdit from './leaseSections/tenant/TenantEdit';
import TenantTab from './leaseSections/tenant/TenantTab';
import ContractEdit from './leaseSections/contract/ContractEdit';
import Contracts from './leaseSections/contract/Contracts';
import RuleEdit from './leaseSections/contract/RuleEdit';
import Rules from './leaseSections/contract/Rules';

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
  fetchSingleLease: Function,
  location: Object,
  params: Object,
  areasForm: Array<Object>,
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
    // const {fetchSingleLease, location, params: {leaseId}} = this.props;
    const {location} = this.props;

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
    // fetchSingleLease(leaseId);
  }

  openEditMode = () => {
    this.setState({isEditMode: true});
  }

  cancel = () => {
    this.setState({isEditMode: false});
  }

  save = () => {
    const {areasForm} = this.props;
    this.setState({areas: areasForm});
    this.setState({isEditMode: false});
  }

  openCommentPanel = () => {
    alert('open comment panel');
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
    const {activeTab, areas, tenants, oldTenants, isEditMode, contracts, rules} = this.state;

    return (
      <div className='lease-page'>
        <Row>
          <Column className='lease-page__upper-bar'>
            <div className='lease-info'>
              <p className='lease-info__label'>Vuokratunnus</p>
              <p className='lease-info__type'>
                <span className='lease-info__number'>A1110-345</span>
                <span className='lease-info__date'>Vuokraus ajalle 01.01.1987 – 31.12.2047</span>
              </p>
            </div>
            <div className='controls'>
              <ControlButtons
                isEditMode={isEditMode}
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
                    {!isEditMode && areas && areas.length > 0 &&
                      areas.map((area, index) =>
                        <PropertyUnit area={area} key={index}/>
                      )
                    }
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

const areasFormName = 'property-unit-edit-form';
const areasFormSelector = formValueSelector(areasFormName);

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        initialValues: getCurrentLease(state),
        isFetching: getIsFetching(state),
        areasForm: areasFormSelector(state, 'areas'),
      };
    },
    {
      fetchSingleLease,
    }
  ),
)(PreparerForm);
