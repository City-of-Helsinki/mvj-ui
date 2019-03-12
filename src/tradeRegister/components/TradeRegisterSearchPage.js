// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';
import Search from '$src/tradeRegister/components/Search';
import TradeRegisterTemplate from '$src/tradeRegister/components/TradeRegisterTemplate';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {PermissionMissingTexts} from '$src/enums';
import {FormNames} from '$src/tradeRegister/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasPermissions, getSearchQuery, getUrlParams, setPageTitle} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  history: Object,
  initialize: Function,
  isFetchingCommonAttributes: boolean, // Via withCommonAttributes HOC
  location: Object,
  receiveTopNavigationSettings: Function,
  usersPermissions: UsersPermissionsType, // Via withCommonAttributes
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

    setPageTitle('Kaupparekisterihaku');

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
    const {isFetchingCommonAttributes, usersPermissions} = this.props;
    const {businessId} = this.state;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.TRADE_REGISTER} /></PageContainer>;

    return (
      <PageContainer>
        <Row>
          <Column small={12} medium={6} large={8}></Column>
          <Column small={12} medium={6} large={4}>
            <Search onSearch={this.handleSearchChange} />
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
  withCommonAttributes,
  withRouter,
  connect(
    null,
    {
      initialize,
      receiveTopNavigationSettings,
    }
  ),
)(TradeRegisterSearchPage);
