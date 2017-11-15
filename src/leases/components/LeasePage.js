// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import {getCurrentLease, getIsFetching} from '../selectors';
import {fetchSingleLease} from '../actions';

import Tabs from '../../components/tabs/Tabs';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';

type State = {
  activeTab: number,
};

type Props = {
  fetchSingleLease: Function,
  location: Object,
  params: Object,
}

class PreparerForm extends Component {
  state: State = {
    activeTab: 0,
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

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;
    console.log(location);

    this.setState({activeTab: tabId}, () => {
      return router.push({
        ...location,
        query: {tab: tabId},
      });
    });
  };

  render() {
    const {activeTab} = this.state;

    return (
      <div className='lease-page'>
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
