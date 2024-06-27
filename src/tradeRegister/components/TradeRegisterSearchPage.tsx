import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import AuthorizationError from "/src/components/authorization/AuthorizationError";
import ContentContainer from "/src/components/content/ContentContainer";
import Divider from "/src/components/content/Divider";
import Loader from "/src/components/loader/Loader";
import PageContainer from "/src/components/content/PageContainer";
import Search from "/src/tradeRegister/components/Search";
import TradeRegisterTemplate from "/src/tradeRegister/components/TradeRegisterTemplate";
import { receiveTopNavigationSettings } from "/src/components/topNavigation/actions";
import { FormNames, PermissionMissingTexts } from "enums";
import { UsersPermissions } from "usersPermissions/enums";
import { hasPermissions, getSearchQuery, getUrlParams, setPageTitle } from "util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  history: Record<string, any>;
  initialize: (...args: Array<any>) => any;
  isFetchingUsersPermissions: boolean;
  location: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  businessId: string;
};

class TradeRegisterSearchPage extends PureComponent<Props, State> {
  state = {
    businessId: ''
  };

  componentDidMount() {
    const {
      initialize,
      location: {
        search
      },
      receiveTopNavigationSettings
    } = this.props;
    const query = getUrlParams(search);
    setPageTitle('Kaupparekisterihaku');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.TRADE_REGISTER),
      pageTitle: 'Kaupparekisterihaku',
      showSearch: false
    });

    if (query.business_id) {
      this.setState({
        businessId: query.business_id
      });
    }

    initialize(FormNames.TRADE_REGISTER_SEARCH, query);
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: currentSearch
      },
      initialize
    } = this.props;
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const searchQuery = getUrlParams(currentSearch);

    if (currentSearch !== prevSearch) {
      this.setState({
        businessId: searchQuery.business_id || ''
      }, () => {
        initialize(FormNames.TRADE_REGISTER_SEARCH, {
          business_id: searchQuery.business_id || ''
        });
      });
    }
  }

  handleSearchChange = query => {
    const {
      history
    } = this.props;
    this.setState({
      businessId: query.business_id
    }, history.push({
      pathname: getRouteById(Routes.TRADE_REGISTER),
      search: getSearchQuery(query)
    }));
  };

  render() {
    const {
      isFetchingUsersPermissions,
      usersPermissions
    } = this.props;
    const {
      businessId
    } = this.state;
    if (isFetchingUsersPermissions) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (isEmpty(usersPermissions)) return null;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.TRADE_REGISTER} /></PageContainer>;
    return <PageContainer>
        <Row>
          <Column small={12} medium={6} large={8}></Column>
          <Column small={12} medium={6} large={4}>
            <Search onSearch={this.handleSearchChange} />
          </Column>
        </Row>

        {businessId && <ContentContainer>
            <h2>{businessId}</h2>
            <Divider />

            <TradeRegisterTemplate businessId={businessId} />
          </ContentContainer>}
      </PageContainer>;
  }

}

export default flowRight(withRouter, connect(state => {
  return {
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  initialize,
  receiveTopNavigationSettings
}))(TradeRegisterSearchPage);