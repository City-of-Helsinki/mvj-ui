// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import PageContainer from '$components/content/PageContainer';
import Search from '$src/tradeRegister/components/Search';
import TradeRegisterTemplate from '$src/tradeRegister/components/TradeRegisterTemplate';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/tradeRegister/enums';
import {getSearchQuery, getUrlParams} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';

type Props = {
  history: Object,
  initialize: Function,
  location: Object,
  receiveTopNavigationSettings: Function,
};

type State = {
  businessId: string,
}

class TradeRegisterSearchPage extends PureComponent<Props, State> {
  state = {
    businessId: '',
  }

  componentDidMount() {
    const {
      initialize,
      location: {search},
      receiveTopNavigationSettings,
    } = this.props;
    const query = getUrlParams(search);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.TRADE_REGISTER),
      pageTitle: 'Kaupparekisterihaku',
      showSearch: false,
    });

    if(query.business_id) {
      this.setState({businessId: query.business_id});
    }

    initialize(FormNames.SEARCH, query);
  }

  componentDidUpdate(prevProps) {
    const {location: {search: currentSearch}, initialize} = this.props;
    const {location: {search: prevSearch}} = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if(currentSearch !== prevSearch) {
      this.setState({
        businessId: searchQuery.business_id || '',
      }, () => {
        initialize(FormNames.SEARCH, {business_id: searchQuery.business_id || ''});
      });
    }
  }

  handleSearchChange = (query) => {
    const {history} = this.props;

    this.setState({businessId: query.business_id},
      history.push({
        pathname: getRouteById(Routes.TRADE_REGISTER),
        search: getSearchQuery(query),
      })
    );
  }

  render() {
    const {businessId} = this.state;

    return (
      <PageContainer>
        <Row>
          <Column small={12} medium={6} large={8}></Column>
          <Column small={12} medium={6} large={4}>
            <Search
              onSearch={this.handleSearchChange}
            />
          </Column>
        </Row>

        {businessId &&
          <ContentContainer>
            <h2>{businessId}</h2>
            <Divider />

            <TradeRegisterTemplate
              businessId={businessId}
            />
          </ContentContainer>
        }
      </PageContainer>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    null,
    {
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(TradeRegisterSearchPage);
