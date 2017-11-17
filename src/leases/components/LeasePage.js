// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import {getCurrentLease, getIsFetching} from '../selectors';
import {fetchSingleLease} from '../actions';

import ControlButtons from './ControlButtons';
import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';
import PropertyUnit from './leaseSections/PropertyUnit';

type State = {
  activeTab: number,
  isEditMode: boolean,
};

type Props = {
  fetchSingleLease: Function,
  location: Object,
  params: Object,
}

class PreparerForm extends Component {
  state: State = {
    activeTab: 0,
    isEditMode: false,
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

    fetchSingleLease(leaseId);
  }

  openEditMode = () => {
    this.setState({isEditMode: true});
  }

  cancel = () => {
    this.setState({isEditMode: false});
  }

  save = () => {
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
    const {activeTab, isEditMode} = this.state;

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
                  <PropertyUnit />
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Vuokralaiset</h1>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Vuokra</h1>
                </div>
              </TabPane>

              <TabPane className="lease-page__tab-content">
                <div className='lease-page__tab-content'>
                  <h1>Päätökset ja sopimukset</h1>
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

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        initialValues: getCurrentLease(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchSingleLease,
    }
  ),
)(PreparerForm);
