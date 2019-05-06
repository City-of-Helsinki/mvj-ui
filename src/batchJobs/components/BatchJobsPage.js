// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import FullWidthContainer from '$components/content/FullWidthContainer';
import PageContainer from '$components/content/PageContainer';
import PageNavigationWrapper from '$components/content/PageNavigationWrapper';
import Runs from '$src/batchJobs/components/Runs';
import Schedules from '$src/batchJobs/components/Schedules';
import Tabs from '$components/tabs/Tabs';
import TabContent from '$components/tabs/TabContent';
import TabPane from '$components/tabs/TabPane';
import Title from '$components/content/Title';

import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {
  getSearchQuery,
  getUrlParams,
  setPageTitle,
} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';

type Props = {
  history: Object,
  location: Object,
  receiveTopNavigationSettings: Function,
}

type State = {
  activeTab: number,
}

class BatchJobsPage extends PureComponent<Props, State> {
  state = {
    activeTab: 0,
  }

  componentDidMount() {
    const {
      receiveTopNavigationSettings,
    } = this.props;

    setPageTitle('Eräajot');

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.BATCH_JOBS),
      pageTitle: 'Eräajot',
      showSearch: false,
    });

    this.setStateFromUrl();

    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = () => {
    this.setStateFromUrl();
  }

  setStateFromUrl = () => {
    const {location: {search}} = this.props;
    const query = getUrlParams(search);
    const tab = query.tab ? Number(query.tab) : 0;

    this.setState({
      activeTab: tab,
    });
  }

  handleTabClick = (tab: number) => {
    const {history, location, location: {search}} = this.props;
    const query = getUrlParams(search);

    this.setState({activeTab: tab}, () => {
      query.tab = tab;

      return history.push({
        ...location,
        search: getSearchQuery(query),
      });
    });
  };

  render() {
    const {activeTab} = this.state;

    return(
      <FullWidthContainer>
        <PageNavigationWrapper>
          <Tabs
            active={activeTab}
            tabs={[
              {
                label: 'Ajot',
                allow: true,
              },
              {
                label: 'Ajastukset',
                allow: true,
              },
            ]}
            onTabClick={this.handleTabClick}
          />
        </PageNavigationWrapper>

        <PageContainer className='with-tabs' hasTabs>
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                <Title>Ajot</Title>
                <Divider/>

                <Runs />
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <Title>Ajastukset</Title>
                <Divider/>

                <Schedules />
              </ContentContainer>
            </TabPane>
          </TabContent>

        </PageContainer>
      </FullWidthContainer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    () => {
      return {
      };
    },
    {
      receiveTopNavigationSettings,
    }
  ),
)(BatchJobsPage);
